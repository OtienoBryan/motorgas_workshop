import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';

@Injectable()
export class JwtService {
  private readonly secretKey = JwtService.requireSecret();
  private readonly expiresIn = process.env.JWT_EXPIRES_IN || '24h';

  private static requireSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 32) {
      throw new Error('JWT_SECRET must be set to a random value of at least 32 characters');
    }
    return secret;
  }

  generateToken(payload: any): string {
    try {
      return jwt.sign(payload, this.secretKey, { expiresIn: this.expiresIn, algorithm: 'HS256', jwtid: randomUUID() } as jwt.SignOptions);
    } catch (error) {
      console.error('❌ [JwtService] Error generating token:', error);
      throw new Error('Token generation failed');
    }
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.secretKey, { algorithms: ['HS256'] });
    } catch (error) {
      console.error('❌ [JwtService] Error verifying token:', error);
      return null;
    }
  }

  decodeToken(token: string): any {
    try {
      return jwt.decode(token);
    } catch (error) {
      console.error('❌ [JwtService] Error decoding token:', error);
      return null;
    }
  }

  isTokenExpired(token: string): boolean {
    try {
      const decoded = jwt.decode(token) as any;
      if (!decoded || !decoded.exp) {
        return true;
      }
      
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      console.error('❌ [JwtService] Error checking token expiration:', error);
      return true;
    }
  }
}
