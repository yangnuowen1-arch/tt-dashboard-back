import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class LoginDto {
  @ApiProperty({ example: "user@example.com", description: "用户邮箱" })
  @IsEmail({}, { message: "邮箱格式不正确" })
  @MaxLength(255, { message: "邮箱长度不能超过 255 个字符" })
  email: string;

  @ApiProperty({ example: "123456", description: "密码" })
  @IsString({ message: "密码必须是字符串" })
  @MinLength(6, { message: "密码长度不能少于 6 位" })
  @MaxLength(50, { message: "密码长度不能超过 50 位" })
  password: string;
}
