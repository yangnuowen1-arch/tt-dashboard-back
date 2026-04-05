# 后端对接提示词：素材批量上传 & 处理流水线

## 一、项目背景

我有一个 Next.js 16 (App Router) 前端管理后台，用于 TikTok 广告素材的批量上传、自动转码修复、发布。
前端已完成，目前全部走 Mock（前端用 setTimeout 模拟队列进度）。
现在需要你帮我实现**后端服务**，替换掉前端的 Mock 逻辑，与前端完成闭环。

技术栈自选（推荐 Node.js/Python/Go 均可），但必须严格遵守下面的接口契约。

---

## 二、需要实现的 3 个 HTTP API

### 1. `POST /api/creatives/batch-presign`

**用途**：前端上传前，批量申请预签名 URL（S3 / OSS / MinIO 等对象存储）。

**Request Body**：
```json
{
  "items": [
    {
      "clientItemId": "1717900000-abc12345",
      "fileName": "ad_video_01.mp4",
      "mime": "video/mp4",
      "sizeBytes": 52428800,
      "kind": "video"
    }
  ]
}
```

字段说明：
- `clientItemId`：前端生成的唯一 ID，后端需原样返回，用于前后端关联
- `fileName`：原始文件名
- `mime`：MIME 类型，可能为 `application/octet-stream`（前端探测不到时）
- `sizeBytes`：文件大小（字节）
- `kind`：`"video"` 或 `"image"`

**Response 200**（JSON 数组，顺序与请求一一对应）：
```json
[
  {
    "clientItemId": "1717900000-abc12345",
    "uploadUrl": "https://your-bucket.s3.amazonaws.com/uploads/xxx?X-Amz-Signature=...",
    "assetUrl": "https://cdn.example.com/assets/xxx.mp4",
    "jobId": "job_uuid_001"
  }
]
```

字段说明：
- `uploadUrl`：预签名的 PUT URL，前端会用 `XMLHttpRequest` 直传文件到这个地址
- `assetUrl`：上传完成后的最终访问地址（CDN 或直链）
- `jobId`：后端生成的任务 ID，用于后续 WebSocket 推送进度

**注意**：前端直传时使用 `PUT` 方法，不带额外 header（除了浏览器默认的）。你的对象存储预签名需要允许这种方式。

---

### 2. `POST /api/creatives/upload-complete`

**用途**：前端直传完成后，通知后端"文件已落地"，后端收到后应将任务入队开始处理（转码/修复/生成封面等）。

**Request Body**：
```json
{
  "jobId": "job_uuid_001",
  "clientItemId": "1717900000-abc12345",
  "assetUrl": "https://cdn.example.com/assets/xxx.mp4"
}
```

**Response 200**：空 body 或 `{}` 即可，前端不读取返回值，只检查 HTTP 状态码。

**后端在此接口被调用后应该做的事**：
1. 从对象存储下载/读取已上传的文件
2. 根据前端传来的 `repairConfig`（见下方"修复配置"章节）执行转码处理
3. 通过 WebSocket 向前端推送处理进度（见下方"WebSocket"章节）

---

### 3. `POST /api/creatives/publish`

**用途**：素材处理完成（状态为 `ready`）后，用户点击"发布"，前端调用此接口将素材推送到广告平台/素材库。

**Request Body**：
```json
{
  "clientItemId": "1717900000-abc12345",
  "assetUrl": "https://cdn.example.com/assets/xxx_processed.mp4",
  "coverUrl": "https://cdn.example.com/assets/xxx_thumb.jpg"
}
```

- `coverUrl` 可选，可能为 `undefined`

**Response 200**：
```json
{
  "publishedId": "pub_12345"
}
```

- `publishedId`：发布后的唯一标识，前端会展示

---

## 三、WebSocket 推送

### 连接方式

前端通过环境变量 `NEXT_PUBLIC_CREATIVE_JOBS_WS` 获取 WebSocket 地址，例如：
```
wss://api.example.com/ws/creative-jobs
```

前端会建立一条 WebSocket 长连接，自带断线重连（指数退避，最大 30 秒）。

### 消息格式

后端需要向前端推送以下 JSON 格式的消息：

```json
{
  "type": "creative_job",
  "clientItemId": "1717900000-abc12345",
  "jobId": "job_uuid_001",
  "status": "processing",
  "progress": 42,
  "assetUrl": "https://cdn.example.com/assets/xxx_processed.mp4",
  "coverUrl": "https://cdn.example.com/assets/xxx_thumb.jpg",
  "error": null
}
```

**字段说明**：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `type` | string | **是** | 固定为 `"creative_job"`，前端靠这个字段过滤消息 |
| `clientItemId` | string | **是** | 前端生成的 ID，前端靠这个匹配到队列项 |
| `jobId` | string | 可选 | 后端任务 ID |
| `status` | string | **是** | 见下方状态机 |
| `progress` | number | 可选 | 处理进度 0-100 |
| `assetUrl` | string | 可选 | 处理完成后的最终资源 URL |
| `coverUrl` | string | 可选 | 视频封面 URL |
| `error` | string \| null | 可选 | 失败时的错误信息 |

**前端只处理 `type === "creative_job"` 且 `clientItemId` 非空的消息**，其他消息会被忽略。

### 推送时机（建议）

后端处理任务时，在以下节点推送消息：

1. 任务入队 → `status: "queued", progress: 0`
2. 开始处理 → `status: "processing", progress: 10`
3. 处理过程中 → `status: "processing", progress: 30/50/70/90`（按实际进度）
4. 处理完成 → `status: "ready", progress: 100, assetUrl: "...", coverUrl: "..."`
5. 处理失败 → `status: "failed", error: "具体错误信息"`

---

## 四、任务状态机

前端定义的完整状态流转（后端只需关心加粗的部分）：

```
pending_upload → uploading → upload_success → **queued** → **processing** → **ready** → published
                                                    ↘              ↘            ↘
                                                   **failed**    **failed**    **failed**
```

- `pending_upload` / `uploading` / `upload_success`：前端自行管理，后端不需要推送
- **`queued`**：后端收到 upload-complete 后入队，推送此状态
- **`processing`**：后端开始转码/处理，推送此状态 + progress
- **`ready`**：处理完成，推送此状态 + assetUrl + coverUrl
- **`failed`**：任何环节失败，推送此状态 + error
- `published`：前端调用 publish 接口成功后自行设置，后端也可以推送

前端只接受以下 status 值通过 WebSocket 更新：
`upload_success` | `queued` | `processing` | `ready` | `published` | `failed`

---

## 五、视频转码修复配置（RepairJobConfig）

前端会在上传前基于文件元数据生成一份修复配置。你的后端处理任务时应消费这份配置。

目前前端在 presign 请求中**没有传递** repairConfig，你需要：
- 方案 A：在 `batch-presign` 接口中增加 `repairConfig` 字段接收
- 方案 B：在 `upload-complete` 接口中增加 `repairConfig` 字段接收
- 方案 C：后端自行探测文件并生成修复计划（与前端逻辑一致即可）

RepairJobConfig 结构：
```typescript
{
  platformId: "tiktok_infeed",
  target: {
    width: 1080,        // 目标宽度
    height: 1920,       // 目标高度
    aspectLabel: "9:16"  // "9:16" | "1:1" | "16:9"
  },
  video: {
    transcodeTo: {
      container: "mp4",
      videoCodec: "h264",
      audioCodec: "aac"
    },
    scaleMode: "cover",       // "cover" 先填满再裁切 | "contain" 留边
    letterbox: "blur",        // "blur" 模糊填充 | "black" 黑边
    allowUpscale: true,       // 是否允许放大低分辨率素材
    minShortSidePx: 540,      // 短边最低像素
    clampDurationSec: {       // 广告时长限制
      min: 5,
      max: 60
    }
  },
  thumbnail: {
    source: "first_frame",    // 封面来源
    format: "jpeg",
    width: 720
  }
}
```

### TikTok In-Feed 广告视频规格参考

| 画幅 | 最小分辨率 | 推荐分辨率 |
|------|-----------|-----------|
| 9:16 | 540×960 | 1080×1920 |
| 1:1 | 640×640 | 1080×1080 |
| 16:9 | 1280×720 | 1280×720 |

- 时长：5–60 秒
- 文件大小上限：500MB（推荐 <100MB）
- 推荐封装：MP4 (H.264 + AAC)

---

## 六、环境变量

前端需要配置以下环境变量来关闭 Mock 并连接后端：

```env
# 设为 false 关闭前端 Mock，走真实 API
NEXT_PUBLIC_CREATIVE_UPLOAD_MOCK=false

# WebSocket 地址，用于接收任务处理进度
NEXT_PUBLIC_CREATIVE_JOBS_WS=wss://your-api-domain.com/ws/creative-jobs
```

---

## 七、前端调用流程总结

```
用户拖入文件
  ↓
前端探测文件元数据 (宽高/时长/MIME)
  ↓
前端生成 clientItemId、validation、repairPlan
  ↓
前端调用 POST /api/creatives/batch-presign
  ↓ 拿到 uploadUrl + assetUrl + jobId
前端用 XHR PUT 直传文件到 uploadUrl（带进度回调）
  ↓
前端调用 POST /api/creatives/upload-complete
  ↓
后端入队处理，通过 WebSocket 推送 queued → processing → ready
  ↓
用户点击发布
  ↓
前端调用 POST /api/creatives/publish
  ↓
完成
```

---

## 八、实现建议

1. **对象存储**：推荐 S3 / MinIO / 阿里云 OSS，实现预签名 PUT URL
2. **任务队列**：推荐 BullMQ (Redis) / Celery / 或简单的内存队列（开发阶段）
3. **视频转码**：推荐 FFmpeg，按 RepairJobConfig 执行转码
4. **WebSocket**：可用 Socket.IO / ws (Node.js) / FastAPI WebSocket (Python)
5. **封面生成**：FFmpeg 抽取第一帧，输出 JPEG

---

## 九、验收标准

1. 前端设置 `NEXT_PUBLIC_CREATIVE_UPLOAD_MOCK=false` 后，上传流程不再走 Mock
2. 文件能通过预签名 URL 直传到对象存储
3. upload-complete 后，后端开始处理并通过 WebSocket 推送进度
4. 处理完成后状态变为 `ready`，前端显示远程 URL 的预览
5. 点击发布后返回 `publishedId`，状态变为 `published`
6. 失败场景正确推送 `failed` + error 信息，前端可重试
