"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_service_1 = require("./jwt.service");
const token_denylist_service_1 = require("./token-denylist.service");
const staff_entity_1 = require("../entities/staff.entity");
const ACTIVE_CACHE_MS = 30 * 1000;
let JwtAuthGuard = class JwtAuthGuard {
    jwtService;
    denylist;
    staffRepository;
    activeCache = new Map();
    constructor(jwtService, denylist, staffRepository) {
        this.jwtService = jwtService;
        this.denylist = denylist;
        this.staffRepository = staffRepository;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new common_1.UnauthorizedException('No token provided');
        }
        const payload = this.jwtService.verifyToken(token);
        if (!payload || !payload.sub) {
            throw new common_1.UnauthorizedException('Invalid or expired token');
        }
        if (this.jwtService.isTokenExpired(token)) {
            throw new common_1.UnauthorizedException('Token expired');
        }
        if (this.denylist.isRevoked(payload.jti)) {
            throw new common_1.UnauthorizedException('Token has been revoked');
        }
        if (!(await this.isStaffActive(payload.sub))) {
            throw new common_1.UnauthorizedException('Account is no longer active');
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
    async isStaffActive(id) {
        const cached = this.activeCache.get(id);
        if (cached && Date.now() - cached.checkedAt < ACTIVE_CACHE_MS) {
            return cached.active;
        }
        const staff = await this.staffRepository.findOne({ where: { id }, select: ['id', 'is_active'] });
        const active = !!staff && Number(staff.is_active) === 1;
        this.activeCache.set(id, { active, checkedAt: Date.now() });
        return active;
    }
    extractTokenFromHeader(request) {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_1.InjectRepository)(staff_entity_1.Staff)),
    __metadata("design:paramtypes", [jwt_service_1.JwtService,
        token_denylist_service_1.TokenDenylistService,
        typeorm_2.Repository])
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map