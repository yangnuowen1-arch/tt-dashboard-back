import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        data: {
            id: number;
            email: string;
            username: string | null;
            role: string;
            isActive: boolean;
            createdAt: Date | null;
            updatedAt: Date | null;
        };
        message: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        data: {
            token: string;
            user: {
                id: number;
                email: string;
                username: string | null;
                role: string;
                isActive: boolean;
                createdAt: Date | null;
                updatedAt: Date | null;
            };
        };
        message: string;
    }>;
}
