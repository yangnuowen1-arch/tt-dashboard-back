"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var CreativesProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreativesProcessor = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ffmpeg = __importStar(require("fluent-ffmpeg"));
const ffmpeg_static_1 = __importDefault(require("ffmpeg-static"));
const fs = __importStar(require("fs"));
const os = __importStar(require("os"));
const path = __importStar(require("path"));
const prisma_service_1 = require("../prisma/prisma.service");
const storage_service_1 = require("../storage/storage.service");
const creatives_gateway_1 = require("./creatives.gateway");
if (ffmpeg_static_1.default) {
    ffmpeg.setFfmpegPath(ffmpeg_static_1.default);
}
let CreativesProcessor = CreativesProcessor_1 = class CreativesProcessor {
    prisma;
    storage;
    gateway;
    config;
    logger = new common_1.Logger(CreativesProcessor_1.name);
    tmpDir;
    constructor(prisma, storage, gateway, config) {
        this.prisma = prisma;
        this.storage = storage;
        this.gateway = gateway;
        this.config = config;
        this.tmpDir = path.join(os.tmpdir(), "tt-creatives");
        if (!fs.existsSync(this.tmpDir)) {
            fs.mkdirSync(this.tmpDir, { recursive: true });
        }
    }
    async process(job) {
        const { jobId, clientItemId, objectKey, kind } = job;
        try {
            this.pushStatus(clientItemId, jobId, "queued", 0);
            this.pushStatus(clientItemId, jobId, "processing", 10);
            const ext = path.extname(objectKey) || ".mp4";
            const localInput = path.join(this.tmpDir, `${jobId}_input${ext}`);
            await this.storage.downloadToFile(objectKey, localInput);
            this.logger.log(`Downloaded ${objectKey} → ${localInput}`);
            if (kind === "video") {
                await this.processVideo(job, localInput);
            }
            else {
                await this.processImage(job, localInput);
            }
        }
        catch (err) {
            const errorMsg = err instanceof Error ? err.message : String(err);
            this.logger.error(`Job ${jobId} failed: ${errorMsg}`);
            await this.prisma.creative_jobs.update({
                where: { job_id: jobId },
                data: { status: "failed", error: errorMsg },
            });
            this.pushStatus(clientItemId, jobId, "failed", undefined, undefined, undefined, errorMsg);
        }
    }
    async processVideo(job, localInput) {
        const { jobId, clientItemId, objectKey, repairConfig } = job;
        const target = repairConfig?.target ?? {
            width: 1080,
            height: 1920,
        };
        const videoConf = repairConfig?.video?.transcodeTo ?? {
            container: "mp4",
            videoCodec: "h264",
            audioCodec: "aac",
        };
        const thumbConf = repairConfig?.thumbnail ?? {
            source: "first_frame",
            format: "jpeg",
            width: 720,
        };
        const scaleMode = repairConfig?.video?.scaleMode ?? "cover";
        const outputKey = objectKey.replace(/(\.[^.]+)$/, "_processed$1");
        const coverKey = objectKey.replace(/(\.[^.]+)$/, "_thumb.jpg");
        const localOutput = path.join(this.tmpDir, `${jobId}_output.mp4`);
        const localCover = path.join(this.tmpDir, `${jobId}_thumb.jpg`);
        this.pushStatus(clientItemId, jobId, "processing", 30);
        await new Promise((resolve, reject) => {
            const codec = videoConf.videoCodec === "h264" ? "libx264" : videoConf.videoCodec;
            let cmd = ffmpeg
                .default(localInput)
                .videoCodec(codec)
                .audioCodec(videoConf.audioCodec)
                .format(videoConf.container);
            if (scaleMode === "cover") {
                cmd = cmd.videoFilter(`scale=${target.width}:${target.height}:force_original_aspect_ratio=increase,crop=${target.width}:${target.height}`);
            }
            else {
                cmd = cmd.videoFilter(`scale=${target.width}:${target.height}:force_original_aspect_ratio=decrease,pad=${target.width}:${target.height}:(ow-iw)/2:(oh-ih)/2:black`);
            }
            cmd
                .on("progress", (progress) => {
                const pct = Math.min(90, 30 + Math.round((progress.percent ?? 0) * 0.6));
                this.pushStatus(clientItemId, jobId, "processing", pct);
            })
                .on("end", () => resolve())
                .on("error", (err) => reject(err))
                .save(localOutput);
        });
        this.logger.log(`Transcode done for ${jobId}`);
        this.pushStatus(clientItemId, jobId, "processing", 90);
        await new Promise((resolve, reject) => {
            ffmpeg
                .default(localInput)
                .screenshots({
                count: 1,
                folder: this.tmpDir,
                filename: `${jobId}_thumb.jpg`,
                size: `${thumbConf.width}x?`,
            })
                .on("end", () => resolve())
                .on("error", (err) => reject(err));
        });
        this.logger.log(`Thumbnail generated for ${jobId}`);
        await this.storage.uploadFromFile(outputKey, localOutput, "video/mp4");
        if (fs.existsSync(localCover)) {
            await this.storage.uploadFromFile(coverKey, localCover, "image/jpeg");
        }
        const processedUrl = this.storage.getPublicUrl(outputKey);
        const coverUrl = fs.existsSync(localCover)
            ? this.storage.getPublicUrl(coverKey)
            : undefined;
        await this.prisma.creative_jobs.update({
            where: { job_id: jobId },
            data: {
                status: "ready",
                progress: 100,
                processed_url: processedUrl,
                cover_url: coverUrl,
            },
        });
        this.pushStatus(clientItemId, jobId, "ready", 100, processedUrl, coverUrl);
        this.cleanup(localInput, localOutput, localCover);
    }
    async processImage(job, localInput) {
        const { jobId, clientItemId, objectKey } = job;
        this.pushStatus(clientItemId, jobId, "processing", 50);
        const processedUrl = this.storage.getPublicUrl(objectKey);
        await this.prisma.creative_jobs.update({
            where: { job_id: jobId },
            data: {
                status: "ready",
                progress: 100,
                processed_url: processedUrl,
            },
        });
        this.pushStatus(clientItemId, jobId, "ready", 100, processedUrl);
        this.cleanup(localInput);
    }
    pushStatus(clientItemId, jobId, status, progress, assetUrl, coverUrl, error) {
        this.gateway.broadcast({
            type: "creative_job",
            clientItemId,
            jobId,
            status,
            progress,
            assetUrl,
            coverUrl,
            error: error ?? null,
        });
    }
    cleanup(...files) {
        for (const f of files) {
            try {
                if (fs.existsSync(f))
                    fs.unlinkSync(f);
            }
            catch {
            }
        }
    }
};
exports.CreativesProcessor = CreativesProcessor;
exports.CreativesProcessor = CreativesProcessor = CreativesProcessor_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        storage_service_1.StorageService,
        creatives_gateway_1.CreativesGateway,
        config_1.ConfigService])
], CreativesProcessor);
//# sourceMappingURL=creatives.processor.js.map