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
export declare class CreativesService {
    private readonly prisma;
    private readonly storage;
    private readonly processor;
    private readonly logger;
    constructor(prisma: PrismaService, storage: StorageService, processor: CreativesProcessor);
    batchPresign(dto: BatchPresignDto): Promise<PresignResult[]>;
    uploadComplete(dto: UploadCompleteDto): Promise<void>;
    publish(dto: PublishDto): Promise<PublishResult>;
}
