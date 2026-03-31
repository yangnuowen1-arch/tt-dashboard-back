import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { users } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import { PrismaService } from "../prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { JwtPayload } from "./interfaces/jwt-payload.interface";

const SALT_ROUNDS = 12;

type AuthUser = {
  id: number;
  email: string;
  username: string | null;
  role: string;
  isActive: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
};

function toAuthUser(user: users): AuthUser {
  return {
    id: user.id,
    email: user.email,
    username: user.name,
    role: user.role ?? "user",
    isActive: user.is_active ?? true,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthUser> {
    const email = registerDto.email.trim().toLowerCase();
    const existingUser = await this.prismaService.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException("邮箱已被注册");
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, SALT_ROUNDS);
    const user = await this.prismaService.users.create({
      data: {
        email,
        password: hashedPassword,
        name: registerDto.username.trim(),
      },
    });

    return toAuthUser(user);
  }

  async login(loginDto: LoginDto): Promise<{ token: string; user: AuthUser }> {
    const email = loginDto.email.trim().toLowerCase();
    const user = await this.prismaService.users.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException("邮箱或密码错误");
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException("邮箱或密码错误");
    }

    if (user.is_active === false) {
      throw new UnauthorizedException("当前账号已被禁用");
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    return {
      token: await this.jwtService.signAsync(payload),
      user: toAuthUser(user),
    };
  }
}
