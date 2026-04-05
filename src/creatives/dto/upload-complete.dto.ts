import { IsOptional, IsString } from "class-validator";

export class UploadCompleteDto {
  @IsString()
  jobId: string;

  @IsString()
  clientItemId: string;

  @IsString()
  assetUrl: string;

  @IsOptional()
  repairConfig?: Record<string, any>;
}
