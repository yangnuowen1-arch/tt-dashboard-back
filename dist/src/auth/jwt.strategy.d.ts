import { ConfigService } from "@nestjs/config";
import { Strategy } from "passport-jwt";
import { PrismaService } from "../prisma/prisma.service";
import { JwtPayload } from "./interfaces/jwt-payload.interface";
type SafeUser = {
    id: number;
    email: string;
    username: string | null;
    role: string;
    isActive: boolean;
};
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly prismaService;
    constructor(configService: ConfigService, prismaService: PrismaService);
    validate(payload: JwtPayload): Promise<SafeUser>;
}
export {};
