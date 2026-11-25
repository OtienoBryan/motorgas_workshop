"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
let AllExceptionsFilter = class AllExceptionsFilter {
    catch(exception, host) {
        const res = host.switchToHttp().getResponse();
        const req = host.switchToHttp().getRequest();
        const status = exception instanceof common_1.HttpException ? exception.getStatus() : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        if (status >= 500) {
            console.error(`❌ [Error] ${req.method} ${req.url}:`, exception);
        }
        if (exception instanceof common_1.HttpException && (status < 500 || process.env.NODE_ENV !== 'production')) {
            const body = exception.getResponse();
            return res.status(status).json(typeof body === 'string' ? { statusCode: status, message: body } : body);
        }
        const message = process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : exception?.message ?? 'Internal server error';
        return res.status(status).json({ statusCode: status, message });
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = __decorate([
    (0, common_1.Catch)()
], AllExceptionsFilter);
//# sourceMappingURL=all-exceptions.filter.js.map