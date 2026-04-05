import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma/prisma.service";
import { StorageService } from "../storage/storage.service";
import { CreativesGateway } from "./creatives.gateway";
interface ProcessingJob {
    jobId: string;
    clientItemId: string;
    objectKey: string;
    kind: "video" | "image";
    repairConfig?: Record<string, any>;
}
export declare class CreativesProcessor {
    private readonly prisma;
    private readonly storage;
    private readonly gateway;
    private readonly config;
    private readonly logger;
    private readonly tmpDir;
    constructor(prisma: PrismaService, storage: StorageService, gateway: CreativesGateway, config: ConfigService);
    process(job: ProcessingJob): Promise<void>;
    private processVideo;
    private processImage;
    private pushStatus;
    private cleanup;
}
export {};
