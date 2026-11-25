"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginLockoutService = void 0;
const common_1 = require("@nestjs/common");
const MAX_FAILURES = 5;
const LOCK_MS = 15 * 60 * 1000;
let LoginLockoutService = class LoginLockoutService {
    attempts = new Map();
    isLocked(email) {
        const entry = this.attempts.get(email.toLowerCase());
        return !!entry && entry.lockedUntil > Date.now();
    }
    recordFailure(email) {
        const key = email.toLowerCase();
        const entry = this.attempts.get(key) ?? { failures: 0, lockedUntil: 0 };
        if (entry.lockedUntil && entry.lockedUntil <= Date.now()) {
            entry.failures = 0;
            entry.lockedUntil = 0;
        }
        entry.failures += 1;
        if (entry.failures >= MAX_FAILURES) {
            entry.lockedUntil = Date.now() + LOCK_MS;
        }
        this.attempts.set(key, entry);
    }
    recordSuccess(email) {
        this.attempts.delete(email.toLowerCase());
    }
};
exports.LoginLockoutService = LoginLockoutService;
exports.LoginLockoutService = LoginLockoutService = __decorate([
    (0, common_1.Injectable)()
], LoginLockoutService);
//# sourceMappingURL=login-lockout.service.js.map