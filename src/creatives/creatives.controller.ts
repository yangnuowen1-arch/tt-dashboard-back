import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreativesService } from "./creatives.service";
import { BatchPresignDto } from "./dto/batch-presign.dto";
import { PublishDto } from "./dto/publish.dto";
import { UploadCompleteDto } from "./dto/upload-complete.dto";

@ApiTags("Creatives")
@Controller("api/creatives")
export class CreativesController {
  constructor(private readonly creativesService: CreativesService) {}

  @Post("batch-presign")
  @HttpCode(200)
  @ApiOperation({ summary: "批量获取预签名上传 URL" })
  async batchPresign(@Body() dto: BatchPresignDto) {
    return this.creativesService.batchPresign(dto);
  }

  @Post("upload-complete")
  @HttpCode(200)
  @ApiOperation({ summary: "通知上传完成，触发后端处理" })
  async uploadComplete(@Body() dto: UploadCompleteDto) {
    await this.creativesService.uploadComplete(dto);
    return {};
  }

  @Post("publish")
  @HttpCode(200)
  @ApiOperation({ summary: "发布素材到广告平台" })
  async publish(@Body() dto: PublishDto) {
    return this.creativesService.publish(dto);
  }
}
