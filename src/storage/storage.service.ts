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
    const endPoint = this.config.get<string>("S3_ENDPOINT", "localhost");
    const portStr = this.config.get<string>("S3_PORT", "");
    const useSSL = this.config.get<string>("S3_USE_SSL", "true") === "true";
    const accessKey = this.config.get<string>("S3_ACCESS_KEY", "");
    const secretKey = this.config.get<string>("S3_SECRET_KEY", "");
    const region = this.config.get<string>("S3_REGION", "auto");
    this.bucket = this.config.get<string>("S3_BUCKET", "creatives");
    this.publicEndpoint = this.config.get<string>("S3_PUBLIC_URL", "");

    const clientOpts: Minio.ClientOptions = {
      endPoint,
      useSSL,
      accessKey,
      secretKey,
      region,
      pathStyle: true,
    };

    if (portStr) {
      clientOpts.port = Number(portStr);
    }

    this.client = new Minio.Client(clientOpts);

    // R2 doesn't support makeBucket — bucket must be pre-created in the dashboard
    try {
      const exists = await this.client.bucketExists(this.bucket);
      if (!exists) {
        this.logger.warn(
          `Bucket "${this.bucket}" not found. Please create it in your storage dashboard.`,
        );
      }
    } catch {
      this.logger.warn(`Could not check bucket existence (normal for R2)`);
    }

    this.logger.log(
      `S3-compatible storage connected → ${endPoint}/${this.bucket}`,
    );
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
   * For R2 with custom domain, the URL is: https://pub.example.com/{objectKey}
   * For MinIO, set S3_PUBLIC_URL=http://localhost:9000/creatives
   */
  getPublicUrl(objectKey: string): string {
    return `${this.publicEndpoint}/${objectKey}`;
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
