import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class RegisterDto {
  @ApiProperty({ example: "user@example.com", description: "用户邮箱" })
  @IsEmail({}, { message: "邮箱格式不正确" })
  @MaxLength(255, { message: "邮箱长度不能超过 255 个字符" })
  email: string;

  @ApiProperty({ example: "123456", description: "密码，6-50 位" })
  @IsString({ message: "密码必须是字符串" })
  @MinLength(6, { message: "密码长度不能少于 6 位" })
  @MaxLength(50, { message: "密码长度不能超过 50 位" })
  password: string;

  @ApiProperty({ example: "yang", description: "用户名，2-100 位" })
  @IsString({ message: "用户名必须是字符串" })
  @MinLength(2, { message: "用户名长度不能少于 2 位" })
  @MaxLength(100, { message: "用户名长度不能超过 100 个字符" })
  username: string;
}
