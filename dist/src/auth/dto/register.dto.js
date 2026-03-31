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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class RegisterDto {
    email;
    password;
    username;
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "user@example.com", description: "用户邮箱" }),
    (0, class_validator_1.IsEmail)({}, { message: "邮箱格式不正确" }),
    (0, class_validator_1.MaxLength)(255, { message: "邮箱长度不能超过 255 个字符" }),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "123456", description: "密码，6-50 位" }),
    (0, class_validator_1.IsString)({ message: "密码必须是字符串" }),
    (0, class_validator_1.MinLength)(6, { message: "密码长度不能少于 6 位" }),
    (0, class_validator_1.MaxLength)(50, { message: "密码长度不能超过 50 位" }),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "yang", description: "用户名，2-100 位" }),
    (0, class_validator_1.IsString)({ message: "用户名必须是字符串" }),
    (0, class_validator_1.MinLength)(2, { message: "用户名长度不能少于 2 位" }),
    (0, class_validator_1.MaxLength)(100, { message: "用户名长度不能超过 100 个字符" }),
    __metadata("design:type", String)
], RegisterDto.prototype, "username", void 0);
//# sourceMappingURL=register.dto.js.map