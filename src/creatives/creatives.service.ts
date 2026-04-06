import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import { PrismaService } from "../prisma/prisma.service";
import { StorageService } from "../storage/storage.service";
import { CreativesProcessor } from "./creatives.processor";
import { BatchPresignDto } from "./dto/batch-presign.dto";
import { PublishDto } from "./dto/publish.dto";
import { UploadCompleteDto } from "./dto/upload-complete.dto";

export interface PresignResult {
  clientItemId: string;
  uploadUrl: string;
  assetUrl: string;
  jobId: string;
}

export interface PublishResult {
  publishedId: string;
}

@Injectable()
export class CreativesService {
  private readonly logger = new Logger(CreativesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
    private readonly processor: CreativesProcessor,
  ) {}

  async batchPresign(dto: BatchPresignDto): Promise<PresignResult[]> {
    const results: PresignResult[] = [];

    for (const item of dto.items) {
      const jobId = `job_${uuidv4()}`;
      const ext = item.fileName.includes(".")
        ? item.fileName.substring(item.fileName.lastIndexOf("."))
        : "";
      const objectKey = `uploads/${jobId}${ext}`;

      const uploadUrl = await this.storage.presignPut(objectKey);
      const assetUrl = this.storage.getPublicUrl(objectKey);

      // Create DB record
      await this.prisma.creative_jobs.create({
        data: {
          job_id: jobId,
          client_item_id: item.clientItemId,
          file_name: item.fileName,
          mime: item.mime,
          size_bytes: BigInt(item.sizeBytes),
          kind: item.kind,
          status: "pending_upload",
          object_key: objectKey,
          asset_url: assetUrl,
        },
      });

      results.push({
        clientItemId: item.clientItemId,
        uploadUrl,
        assetUrl,
        jobId,
      });

      this.logger.log(
        `Presigned URL created: jobId=${jobId}, file=${item.fileName}`,
      );
    }

    return results;
  }

  async uploadComplete(dto: UploadCompleteDto): Promise<void> {
    const job = await this.prisma.creative_jobs.findUnique({
      where: { job_id: dto.jobId },
    });

    if (!job) {
      throw new NotFoundException(`Job ${dto.jobId} not found`);
    }

    // Update status and optionally store repairConfig
    await this.prisma.creative_jobs.update({
      where: { job_id: dto.jobId },
      data: {
        status: "queued",
        repair_config: dto.repairConfig ?? undefined,
      },
    });

    // Fire-and-forget: start processing asynchronously
    this.processor
      .process({
        jobId: dto.jobId,
        clientItemId: dto.clientItemId,
        objectKey: job.object_key,
        kind: job.kind as "video" | "image",
        repairConfig: dto.repairConfig,
      })
      .catch((err) => {
        this.logger.error(`Processing failed for job ${dto.jobId}`, err);
      });
  }

  async publish(dto: PublishDto): Promise<PublishResult> {
    const job = await this.prisma.creative_jobs.findFirst({
      where: { client_item_id: dto.clientItemId },
    });

    if (!job) {
      throw new NotFoundException(
        `Job with clientItemId ${dto.clientItemId} not found`,
      );
    }

    const publishedId = `pub_${uuidv4().slice(0, 8)}`;

    await this.prisma.creative_jobs.update({
      where: { job_id: job.job_id },
      data: {
        status: "published",
        published_id: publishedId,
      },
    });

    this.logger.log(
      `Published: clientItemId=${dto.clientItemId}, publishedId=${publishedId}`,
    );

    return { publishedId };
  }
}
