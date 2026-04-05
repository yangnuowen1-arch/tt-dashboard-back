import { CreativesService } from "./creatives.service";
import { BatchPresignDto } from "./dto/batch-presign.dto";
import { PublishDto } from "./dto/publish.dto";
import { UploadCompleteDto } from "./dto/upload-complete.dto";
export declare class CreativesController {
    private readonly creativesService;
    constructor(creativesService: CreativesService);
    batchPresign(dto: BatchPresignDto): Promise<import("./creatives.service").PresignResult[]>;
    uploadComplete(dto: UploadCompleteDto): Promise<{}>;
    publish(dto: PublishDto): Promise<import("./creatives.service").PublishResult>;
}
