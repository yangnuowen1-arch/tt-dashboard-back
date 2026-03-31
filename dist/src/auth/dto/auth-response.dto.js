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
exports.ErrorResponseDto = exports.LoginResponseDto = exports.RegisterResponseDto = exports.LoginDataDto = exports.AuthUserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class AuthUserDto {
    id;
    email;
    username;
    role;
    isActive;
    createdAt;
    updatedAt;
}
exports.AuthUserDto = AuthUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], AuthUserDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "user@example.com" }),
    __metadata("design:type", String)
], AuthUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "yang", nullable: true }),
    __metadata("design:type", Object)
], AuthUserDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "user" }),
    __metadata("design:type", String)
], AuthUserDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], AuthUserDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "2026-03-31T00:00:00.000Z", nullable: true }),
    __metadata("design:type", Object)
], AuthUserDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "2026-03-31T00:00:00.000Z", nullable: true }),
    __metadata("design:type", Object)
], AuthUserDto.prototype, "updatedAt", void 0);
class LoginDataDto {
    token;
    user;
}
exports.LoginDataDto = LoginDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }),
    __metadata("design:type", String)
], LoginDataDto.prototype, "token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => AuthUserDto }),
    __metadata("design:type", AuthUserDto)
], LoginDataDto.prototype, "user", void 0);
class RegisterResponseDto {
    success;
    data;
    message;
}
exports.RegisterResponseDto = RegisterResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], RegisterResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => AuthUserDto }),
    __metadata("design:type", AuthUserDto)
], RegisterResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "注册成功" }),
    __metadata("design:type", String)
], RegisterResponseDto.prototype, "message", void 0);
class LoginResponseDto {
    success;
    data;
    message;
}
exports.LoginResponseDto = LoginResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], LoginResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => LoginDataDto }),
    __metadata("design:type", LoginDataDto)
], LoginResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "登录成功" }),
    __metadata("design:type", String)
], LoginResponseDto.prototype, "message", void 0);
class ErrorResponseDto {
    success;
    data;
    message;
}
exports.ErrorResponseDto = ErrorResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    __metadata("design:type", Boolean)
], ErrorResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: null, nullable: true, type: String }),
    __metadata("design:type", void 0)
], ErrorResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "邮箱或密码错误" }),
    __metadata("design:type", String)
], ErrorResponseDto.prototype, "message", void 0);
//# sourceMappingURL=auth-response.dto.js.map