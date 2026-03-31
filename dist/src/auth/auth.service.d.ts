import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
type AuthUser = {
    id: number;
    email: string;
    username: string | null;
    role: string;
    isActive: boolean;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export declare class AuthService {
    private readonly prismaService;
    private readonly jwtService;
    constructor(prismaService: PrismaService, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<AuthUser>;
    login(loginDto: LoginDto): Promise<{
        token: string;
        user: AuthUser;
    }>;
}
export {};
