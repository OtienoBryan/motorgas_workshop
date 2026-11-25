"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const MUTATING = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const LOG_DIR = process.env.AUDIT_LOG_DIR || (0, path_1.join)(process.cwd(), 'logs');
let AuditInterceptor = class AuditInterceptor {
    intercept(context, next) {
        const req = context.switchToHttp().getRequest();
        if (!MUTATING.has(req.method)) {
            return next.handle();
        }
        const res = context.switchToHttp().getResponse();
        const started = Date.now();
        const write = (outcome, status) => {
            const entry = {
                ts: new Date().toISOString(),
                userId: req.user?.sub ?? null,
                role: req.user?.role ?? null,
                method: req.method,
                path: String(req.originalUrl || req.url).split('?')[0],
                ip: req.ip,
                status,
                outcome,
                ms: Date.now() - started,
            };
            const line = JSON.stringify(entry);
            console.log(`📝 [Audit] ${line}`);
            (0, promises_1.mkdir)(LOG_DIR, { recursive: true })
                .then(() => (0, promises_1.appendFile)((0, path_1.join)(LOG_DIR, 'audit.log'), line + '\n'))
                .catch(() => undefined);
        };
        return next.handle().pipe((0, operators_1.tap)({
            next: () => write('success', res.statusCode),
            error: (err) => write('failure', err?.status ?? 500),
        }));
    }
};
exports.AuditInterceptor = AuditInterceptor;
exports.AuditInterceptor = AuditInterceptor = __decorate([
    (0, common_1.Injectable)()
], AuditInterceptor);
//# sourceMappingURL=audit.interceptor.js.map