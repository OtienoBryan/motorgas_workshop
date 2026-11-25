import { Repository } from 'typeorm';
import { Staff } from '../entities/staff.entity';
import { LoginDto } from './dto/login.dto';
import { JwtService } from './jwt.service';
import { LoginLockoutService } from './login-lockout.service';
export interface AuthResponse {
    token: string;
    user: {
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
    };
}
export declare class AuthService {
    private staffRepository;
    private jwtService;
    private lockout;
    constructor(staffRepository: Repository<Staff>, jwtService: JwtService, lockout: LoginLockoutService);
    validateStaff(email: string, password: string): Promise<Staff | null>;
    login(loginDto: LoginDto): Promise<AuthResponse>;
    getStaffById(id: number): Promise<Staff | null>;
    validateToken(token: string): Promise<Staff | null>;
    hashPassword(password: string): Promise<string>;
    verifyPassword(password: string, hashedPassword: string): Promise<boolean>;
}
