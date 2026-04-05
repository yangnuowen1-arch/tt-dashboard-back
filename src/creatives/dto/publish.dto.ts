import { IsOptional, IsString } from "class-validator";

export class PublishDto {
  @IsString()
  clientItemId: string;

  @IsString()
  assetUrl: string;

  @IsOptional()
  @IsString()
  coverUrl?: string;
}
