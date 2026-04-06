import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

import { PrismaService } from "../prisma/prisma.service";
import { StorageService } from "../storage/storage.service";
import { CreativesGateway } from "./creatives.gateway";

if (ffmpegPath) {
  ffmpeg.setFfmpegPath(ffmpegPath);
}

interface ProcessingJob {
  jobId: string;
  clientItemId: string;
  objectKey: string;
  kind: "video" | "image";
  repairConfig?: Record<string, any>;
}

@Injectable()
export class CreativesProcessor {
  private readonly logger = new Logger(CreativesProcessor.name);
  private readonly tmpDir: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
    private readonly gateway: CreativesGateway,
    private readonly config: ConfigService,
  ) {
    this.tmpDir = path.join(os.tmpdir(), "tt-creatives");
    if (!fs.existsSync(this.tmpDir)) {
      fs.mkdirSync(this.tmpDir, { recursive: true });
    }
  }

  /**
   * Enqueue and process a job. Runs asynchronously (fire-and-forget from the controller).
   */
  async process(job: ProcessingJob): Promise<void> {
    const { jobId, clientItemId, objectKey, kind } = job;

    try {
      // 1. Mark as queued
      this.pushStatus(clientItemId, jobId, "queued", 0);

      // 2. Download the original file from MinIO
      this.pushStatus(clientItemId, jobId, "processing", 10);
      const ext = path.extname(objectKey) || ".mp4";
      const localInput = path.join(this.tmpDir, `${jobId}_input${ext}`);
      await this.storage.downloadToFile(objectKey, localInput);
      this.logger.log(`Downloaded ${objectKey} → ${localInput}`);

      if (kind === "video") {
        await this.processVideo(job, localInput);
      } else {
        await this.processImage(job, localInput);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      this.logger.error(`Job ${jobId} failed: ${errorMsg}`);

      await this.prisma.creative_jobs.update({
        where: { job_id: jobId },
        data: { status: "failed", error: errorMsg },
      });

      this.pushStatus(
        clientItemId,
        jobId,
        "failed",
        undefined,
        undefined,
        undefined,
        errorMsg,
      );
    }
  }

  private async processVideo(
    job: ProcessingJob,
    localInput: string,
  ): Promise<void> {
    const { jobId, clientItemId, objectKey, repairConfig } = job;

    // Determine output settings from repairConfig or defaults
    const target: { width: number; height: number } = (repairConfig?.target as {
      width: number;
      height: number;
    }) ?? {
      width: 1080,
      height: 1920,
    };
    const videoConf: {
      container: string;
      videoCodec: string;
      audioCodec: string;
    } = ((repairConfig?.video as Record<string, unknown>)?.transcodeTo as {
      container: string;
      videoCodec: string;
      audioCodec: string;
    }) ?? {
      container: "mp4",
      videoCodec: "h264",
      audioCodec: "aac",
    };
    const thumbConf: { source: string; format: string; width: number } =
      (repairConfig?.thumbnail as {
        source: string;
        format: string;
        width: number;
      }) ?? {
        source: "first_frame",
        format: "jpeg",
        width: 720,
      };
    const scaleMode: string =
      ((repairConfig?.video as Record<string, unknown>)?.scaleMode as string) ??
      "cover";

    const outputKey = objectKey.replace(/(\.[^.]+)$/, "_processed$1");
    const coverKey = objectKey.replace(/(\.[^.]+)$/, "_thumb.jpg");
    const localOutput = path.join(this.tmpDir, `${jobId}_output.mp4`);
    const localCover = path.join(this.tmpDir, `${jobId}_thumb.jpg`);

    this.pushStatus(clientItemId, jobId, "processing", 30);

    // Transcode video
    await new Promise<void>((resolve, reject) => {
      const codec =
        videoConf.videoCodec === "h264" ? "libx264" : videoConf.videoCodec;
      let cmd = ffmpeg
        .default(localInput)
        .videoCodec(codec)
        .audioCodec(videoConf.audioCodec)
        .format(videoConf.container);

      if (scaleMode === "cover") {
        cmd = cmd.videoFilter(
          `scale=${target.width}:${target.height}:force_original_aspect_ratio=increase,crop=${target.width}:${target.height}`,
        );
      } else {
        cmd = cmd.videoFilter(
          `scale=${target.width}:${target.height}:force_original_aspect_ratio=decrease,pad=${target.width}:${target.height}:(ow-iw)/2:(oh-ih)/2:black`,
        );
      }

      cmd
        .on("progress", (progress: { percent?: number }) => {
          const pct = Math.min(
            90,
            30 + Math.round((progress.percent ?? 0) * 0.6),
          );
          this.pushStatus(clientItemId, jobId, "processing", pct);
        })
        .on("end", () => resolve())
        .on("error", (err: Error) => reject(err))
        .save(localOutput);
    });

    this.logger.log(`Transcode done for ${jobId}`);
    this.pushStatus(clientItemId, jobId, "processing", 90);

    // Generate thumbnail (first frame)
    await new Promise<void>((resolve, reject) => {
      ffmpeg
        .default(localInput)
        .screenshots({
          count: 1,
          folder: this.tmpDir,
          filename: `${jobId}_thumb.jpg`,
          size: `${thumbConf.width}x?`,
        })
        .on("end", () => resolve())
        .on("error", (err: Error) => reject(err));
    });

    this.logger.log(`Thumbnail generated for ${jobId}`);

    // Upload processed files back to MinIO
    await this.storage.uploadFromFile(outputKey, localOutput, "video/mp4");
    if (fs.existsSync(localCover)) {
      await this.storage.uploadFromFile(coverKey, localCover, "image/jpeg");
    }

    const processedUrl = this.storage.getPublicUrl(outputKey);
    const coverUrl = fs.existsSync(localCover)
      ? this.storage.getPublicUrl(coverKey)
      : undefined;

    // Update DB
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

    // Cleanup temp files
    this.cleanup(localInput, localOutput, localCover);
  }

  private async processImage(
    job: ProcessingJob,
    localInput: string,
  ): Promise<void> {
    const { jobId, clientItemId, objectKey } = job;

    this.pushStatus(clientItemId, jobId, "processing", 50);

    // For images, just upload as-is (could add resize logic later)
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

  private pushStatus(
    clientItemId: string,
    jobId: string,
    status: string,
    progress?: number,
    assetUrl?: string,
    coverUrl?: string,
    error?: string,
  ): void {
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

  private cleanup(...files: string[]): void {
    for (const f of files) {
      try {
        if (fs.existsSync(f)) fs.unlinkSync(f);
      } catch {
        // ignore cleanup errors
      }
    }
  }
}
