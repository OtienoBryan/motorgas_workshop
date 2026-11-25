import { AuthService } from './auth.service';
import { TokenDenylistService } from './token-denylist.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    private readonly denylist;
    constructor(authService: AuthService, denylist: TokenDenylistService);
    login(loginDto: LoginDto): Promise<import("./auth.service").AuthResponse>;
    logout(req: any): {
        message: string;
    };
    getProfile(req: any): Promise<{
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
    }>;
}
