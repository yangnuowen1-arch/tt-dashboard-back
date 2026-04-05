import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as Minio from "minio";

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private client: Minio.Client;
  private bucket: string;
  private publicEndpoint: string;

  constructor(private readonly config: ConfigService) {}

  async onModuleInit(): Promise<void> {
    const endPoint = this.config.get<string>("MINIO_ENDPOINT", "localhost");
    const port = this.config.get<number>("MINIO_PORT", 9000);
    const useSSL = this.config.get<string>("MINIO_USE_SSL", "false") === "true";
    const accessKey = this.config.get<string>("MINIO_ACCESS_KEY", "minioadmin");
    const secretKey = this.config.get<string>("MINIO_SECRET_KEY", "minioadmin");
    this.bucket = this.config.get<string>("MINIO_BUCKET", "creatives");
    this.publicEndpoint = this.config.get<string>(
      "MINIO_PUBLIC_ENDPOINT",
      `http://${endPoint}:${port}`,
    );

    this.client = new Minio.Client({
      endPoint,
      port,
      useSSL,
      accessKey,
      secretKey,
    });

    const exists = await this.client.bucketExists(this.bucket);
    if (!exists) {
      await this.client.makeBucket(this.bucket);
      this.logger.log(`Bucket "${this.bucket}" created`);
    }

    this.logger.log(`MinIO connected → ${endPoint}:${port}/${this.bucket}`);
  }

  /**
   * Generate a presigned PUT URL for direct upload from the browser.
   */
  async presignPut(objectKey: string, expirySeconds = 3600): Promise<string> {
    return this.client.presignedPutObject(
      this.bucket,
      objectKey,
      expirySeconds,
    );
  }

  /**
   * Build the public / CDN URL for an object.
   */
  getPublicUrl(objectKey: string): string {
    return `${this.publicEndpoint}/${this.bucket}/${objectKey}`;
  }

  /**
   * Download an object to a local file path.
   */
  async downloadToFile(objectKey: string, filePath: string): Promise<void> {
    await this.client.fGetObject(this.bucket, objectKey, filePath);
  }

  /**
   * Upload a local file to the bucket.
   */
  async uploadFromFile(
    objectKey: string,
    filePath: string,
    contentType?: string,
  ): Promise<void> {
    const metaData: Record<string, string> = {};
    if (contentType) {
      metaData["Content-Type"] = contentType;
    }
    await this.client.fPutObject(this.bucket, objectKey, filePath, metaData);
  }

  getClient(): Minio.Client {
    return this.client;
  }

  getBucket(): string {
    return this.bucket;
  }
}
