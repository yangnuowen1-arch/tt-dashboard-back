import { ApiProperty } from "@nestjs/swagger";

export class AuthUserDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: "user@example.com" })
  email: string;

  @ApiProperty({ example: "yang", nullable: true })
  username: string | null;

  @ApiProperty({ example: "user" })
  role: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: "2026-03-31T00:00:00.000Z", nullable: true })
  createdAt: Date | null;

  @ApiProperty({ example: "2026-03-31T00:00:00.000Z", nullable: true })
  updatedAt: Date | null;
}

export class LoginDataDto {
  @ApiProperty({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." })
  token: string;

  @ApiProperty({ type: () => AuthUserDto })
  user: AuthUserDto;
}

export class RegisterResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: () => AuthUserDto })
  data: AuthUserDto;

  @ApiProperty({ example: "注册成功" })
  message: string;
}

export class LoginResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: () => LoginDataDto })
  data: LoginDataDto;

  @ApiProperty({ example: "登录成功" })
  message: string;
}

export class ErrorResponseDto {
  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({ example: null, nullable: true, type: String })
  data: null;

  @ApiProperty({ example: "邮箱或密码错误" })
  message: string;
}
