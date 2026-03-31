export declare class AuthUserDto {
    id: number;
    email: string;
    username: string | null;
    role: string;
    isActive: boolean;
    createdAt: Date | null;
    updatedAt: Date | null;
}
export declare class LoginDataDto {
    token: string;
    user: AuthUserDto;
}
export declare class RegisterResponseDto {
    success: boolean;
    data: AuthUserDto;
    message: string;
}
export declare class LoginResponseDto {
    success: boolean;
    data: LoginDataDto;
    message: string;
}
export declare class ErrorResponseDto {
    success: boolean;
    data: null;
    message: string;
}
