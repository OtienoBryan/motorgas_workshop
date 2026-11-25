import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Repository } from 'typeorm';
import { JwtService } from './jwt.service';
import { TokenDenylistService } from './token-denylist.service';
import { Staff } from '../entities/staff.entity';
export declare class JwtAuthGuard implements CanActivate {
    private jwtService;
    private denylist;
    private staffRepository;
    private readonly activeCache;
    constructor(jwtService: JwtService, denylist: TokenDenylistService, staffRepository: Repository<Staff>);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private isStaffActive;
    private extractTokenFromHeader;
}
