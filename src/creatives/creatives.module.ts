import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { StorageModule } from "../storage/storage.module";
import { CreativesController } from "./creatives.controller";
import { CreativesGateway } from "./creatives.gateway";
import { CreativesProcessor } from "./creatives.processor";
import { CreativesService } from "./creatives.service";

@Module({
  imports: [PrismaModule, StorageModule],
  controllers: [CreativesController],
  providers: [CreativesService, CreativesGateway, CreativesProcessor],
})
export class CreativesModule {}
