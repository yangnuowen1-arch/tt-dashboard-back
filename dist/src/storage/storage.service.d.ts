import { OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as Minio from "minio";
export declare class StorageService implements OnModuleInit {
    private readonly config;
    private readonly logger;
    private client;
    private bucket;
    private publicEndpoint;
    constructor(config: ConfigService);
    onModuleInit(): Promise<void>;
    presignPut(objectKey: string, expirySeconds?: number): Promise<string>;
    getPublicUrl(objectKey: string): string;
    downloadToFile(objectKey: string, filePath: string): Promise<void>;
    uploadFromFile(objectKey: string, filePath: string, contentType?: string): Promise<void>;
    getClient(): Minio.Client;
    getBucket(): string;
}
