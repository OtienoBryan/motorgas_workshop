import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from './jwt.service';
import { TokenDenylistService } from './token-denylist.service';
import { Staff } from '../entities/staff.entity';

const ACTIVE_CACHE_MS = 30 * 1000;

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly activeCache = new Map<number, { active: boolean; checkedAt: number }>();

  constructor(
    private jwtService: JwtService,
    private denylist: TokenDenylistService,
    @InjectRepository(Staff) private staffRepository: Repository<Staff>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const payload = this.jwtService.verifyToken(token);

    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    if (this.jwtService.isTokenExpired(token)) {
      throw new UnauthorizedException('Token expired');
    }

    if (this.denylist.isRevoked(payload.jti)) {
      throw new UnauthorizedException('Token has been revoked');
    }

    // Deactivated accounts lose access immediately (checked at most every 30s per user)
    if (!(await this.isStaffActive(payload.sub))) {
      throw new UnauthorizedException('Account is no longer active');
    }

    request.user = {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
      name: payload.name,
      jti: payload.jti,
      exp: payload.exp,
    };

    return true;
  }

  private async isStaffActive(id: number): Promise<boolean> {
    const cached = this.activeCache.get(id);
    if (cached && Date.now() - cached.checkedAt < ACTIVE_CACHE_MS) {
      return cached.active;
    }
    const staff = await this.staffRepository.findOne({ where: { id }, select: ['id', 'is_active'] });
    const active = !!staff && Number(staff.is_active) === 1;
    this.activeCache.set(id, { active, checkedAt: Date.now() });
    return active;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
