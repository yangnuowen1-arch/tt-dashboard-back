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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreativesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const creatives_service_1 = require("./creatives.service");
const batch_presign_dto_1 = require("./dto/batch-presign.dto");
const publish_dto_1 = require("./dto/publish.dto");
const upload_complete_dto_1 = require("./dto/upload-complete.dto");
let CreativesController = class CreativesController {
    creativesService;
    constructor(creativesService) {
        this.creativesService = creativesService;
    }
    async batchPresign(dto) {
        return this.creativesService.batchPresign(dto);
    }
    async uploadComplete(dto) {
        await this.creativesService.uploadComplete(dto);
        return {};
    }
    async publish(dto) {
        return this.creativesService.publish(dto);
    }
};
exports.CreativesController = CreativesController;
__decorate([
    (0, common_1.Post)("batch-presign"),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: "批量获取预签名上传 URL" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [batch_presign_dto_1.BatchPresignDto]),
    __metadata("design:returntype", Promise)
], CreativesController.prototype, "batchPresign", null);
__decorate([
    (0, common_1.Post)("upload-complete"),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: "通知上传完成，触发后端处理" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [upload_complete_dto_1.UploadCompleteDto]),
    __metadata("design:returntype", Promise)
], CreativesController.prototype, "uploadComplete", null);
__decorate([
    (0, common_1.Post)("publish"),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: "发布素材到广告平台" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [publish_dto_1.PublishDto]),
    __metadata("design:returntype", Promise)
], CreativesController.prototype, "publish", null);
exports.CreativesController = CreativesController = __decorate([
    (0, swagger_1.ApiTags)("Creatives"),
    (0, common_1.Controller)("api/creatives"),
    __metadata("design:paramtypes", [creatives_service_1.CreativesService])
], CreativesController);
//# sourceMappingURL=creatives.controller.js.map