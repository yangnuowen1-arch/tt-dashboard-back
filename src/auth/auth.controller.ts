import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import {
  ErrorResponseDto,
  LoginResponseDto,
  RegisterResponseDto,
} from "./dto/auth-response.dto";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @ApiOperation({
    summary: "用户注册",
    description: "通过邮箱、密码、用户名注册新账号",
  })
  @ApiCreatedResponse({ description: "注册成功", type: RegisterResponseDto })
  @ApiConflictResponse({ description: "邮箱已被注册", type: ErrorResponseDto })
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);

    return {
      data: user,
      message: "注册成功",
    };
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "用户登录",
    description: "通过邮箱和密码登录，返回 JWT Token",
  })
  @ApiOkResponse({ description: "登录成功", type: LoginResponseDto })
  @ApiUnauthorizedResponse({
    description: "邮箱或密码错误",
    type: ErrorResponseDto,
  })
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);

    return {
      data: result,
      message: "登录成功",
    };
  }
}
