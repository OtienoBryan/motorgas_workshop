"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var JwtService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtService = void 0;
const common_1 = require("@nestjs/common");
const jwt = __importStar(require("jsonwebtoken"));
const crypto_1 = require("crypto");
let JwtService = JwtService_1 = class JwtService {
    secretKey = JwtService_1.requireSecret();
    expiresIn = process.env.JWT_EXPIRES_IN || '24h';
    static requireSecret() {
        const secret = process.env.JWT_SECRET;
        if (!secret || secret.length < 32) {
            throw new Error('JWT_SECRET must be set to a random value of at least 32 characters');
        }
        return secret;
    }
    generateToken(payload) {
        try {
            return jwt.sign(payload, this.secretKey, { expiresIn: this.expiresIn, algorithm: 'HS256', jwtid: (0, crypto_1.randomUUID)() });
        }
        catch (error) {
            console.error('❌ [JwtService] Error generating token:', error);
            throw new Error('Token generation failed');
        }
    }
    verifyToken(token) {
        try {
            return jwt.verify(token, this.secretKey, { algorithms: ['HS256'] });
        }
        catch (error) {
            console.error('❌ [JwtService] Error verifying token:', error);
            return null;
        }
    }
    decodeToken(token) {
        try {
            return jwt.decode(token);
        }
        catch (error) {
            console.error('❌ [JwtService] Error decoding token:', error);
            return null;
        }
    }
    isTokenExpired(token) {
        try {
            const decoded = jwt.decode(token);
            if (!decoded || !decoded.exp) {
                return true;
            }
            const currentTime = Math.floor(Date.now() / 1000);
            return decoded.exp < currentTime;
        }
        catch (error) {
            console.error('❌ [JwtService] Error checking token expiration:', error);
            return true;
        }
    }
};
exports.JwtService = JwtService;
exports.JwtService = JwtService = JwtService_1 = __decorate([
    (0, common_1.Injectable)()
], JwtService);
//# sourceMappingURL=jwt.service.js.map