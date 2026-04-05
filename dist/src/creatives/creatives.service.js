"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CreativesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreativesService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const prisma_service_1 = require("../prisma/prisma.service");
const storage_service_1 = require("../storage/storage.service");
const creatives_processor_1 = require("./creatives.processor");
let CreativesService = CreativesService_1 = class CreativesService {
    prisma;
    storage;
    processor;
    logger = new common_1.Logger(CreativesService_1.name);
    constructor(prisma, storage, processor) {
        this.prisma = prisma;
        this.storage = storage;
        this.processor = processor;
    }
    async batchPresign(dto) {
        const results = [];
        for (const item of dto.items) {
            const jobId = `job_${(0, uuid_1.v4)()}`;
            const ext = item.fileName.includes(".")
                ? item.fileName.substring(item.fileName.lastIndexOf("."))
                : "";
            const objectKey = `uploads/${jobId}${ext}`;
            const uploadUrl = await this.storage.presignPut(objectKey);
            const assetUrl = this.storage.getPublicUrl(objectKey);
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
            this.logger.log(`Presigned URL created: jobId=${jobId}, file=${item.fileName}`);
        }
        return results;
    }
    async uploadComplete(dto) {
        const job = await this.prisma.creative_jobs.findUnique({
            where: { job_id: dto.jobId },
        });
        if (!job) {
            throw new common_1.NotFoundException(`Job ${dto.jobId} not found`);
        }
        await this.prisma.creative_jobs.update({
            where: { job_id: dto.jobId },
            data: {
                status: "queued",
                repair_config: dto.repairConfig ?? undefined,
            },
        });
        this.processor
            .process({
            jobId: dto.jobId,
            clientItemId: dto.clientItemId,
            objectKey: job.object_key,
            kind: job.kind,
            repairConfig: dto.repairConfig,
        })
            .catch((err) => {
            this.logger.error(`Processing failed for job ${dto.jobId}`, err);
        });
    }
    async publish(dto) {
        const job = await this.prisma.creative_jobs.findFirst({
            where: { client_item_id: dto.clientItemId },
        });
        if (!job) {
            throw new common_1.NotFoundException(`Job with clientItemId ${dto.clientItemId} not found`);
        }
        const publishedId = `pub_${(0, uuid_1.v4)().slice(0, 8)}`;
        await this.prisma.creative_jobs.update({
            where: { job_id: job.job_id },
            data: {
                status: "published",
                published_id: publishedId,
            },
        });
        this.logger.log(`Published: clientItemId=${dto.clientItemId}, publishedId=${publishedId}`);
        return { publishedId };
    }
};
exports.CreativesService = CreativesService;
exports.CreativesService = CreativesService = CreativesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        storage_service_1.StorageService,
        creatives_processor_1.CreativesProcessor])
], CreativesService);
//# sourceMappingURL=creatives.service.js.map