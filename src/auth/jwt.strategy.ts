import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { users } from "@prisma/client";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../prisma/prisma.service";
import { JwtPayload } from "./interfaces/jwt-payload.interface";

type SafeUser = {
  id: number;
  email: string;
  username: string | null;
  role: string;
  isActive: boolean;
};

function toSafeUser(user: users): SafeUser {
  return {
    id: user.id,
    email: user.email,
    username: user.name,
    role: user.role ?? "user",
    isActive: user.is_active ?? true,
  };
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>("JWT_SECRET"),
    });
  }

  async validate(payload: JwtPayload): Promise<SafeUser> {
    const user = await this.prismaService.users.findUnique({
      where: { id: payload.sub },
    });

    if (!user || user.is_active === false) {
      throw new UnauthorizedException("登录状态无效");
    }

    return toSafeUser(user);
  }
}
