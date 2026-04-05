import { Type } from "class-transformer";
import {
  IsArray,
  IsIn,
  IsNumber,
  IsString,
  ValidateNested,
} from "class-validator";

export class PresignItemDto {
  @IsString()
  clientItemId: string;

  @IsString()
  fileName: string;

  @IsString()
  mime: string;

  @IsNumber()
  sizeBytes: number;

  @IsIn(["video", "image"])
  kind: "video" | "image";
}

export class BatchPresignDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PresignItemDto)
  items: PresignItemDto[];
}
