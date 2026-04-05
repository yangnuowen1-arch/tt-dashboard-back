"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreativesModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../prisma/prisma.module");
const storage_module_1 = require("../storage/storage.module");
const creatives_controller_1 = require("./creatives.controller");
const creatives_gateway_1 = require("./creatives.gateway");
const creatives_processor_1 = require("./creatives.processor");
const creatives_service_1 = require("./creatives.service");
let CreativesModule = class CreativesModule {
};
exports.CreativesModule = CreativesModule;
exports.CreativesModule = CreativesModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, storage_module_1.StorageModule],
        controllers: [creatives_controller_1.CreativesController],
        providers: [creatives_service_1.CreativesService, creatives_gateway_1.CreativesGateway, creatives_processor_1.CreativesProcessor],
    })
], CreativesModule);
//# sourceMappingURL=creatives.module.js.map