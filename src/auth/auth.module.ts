import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtService } from './jwt.service';
import { Staff } from '../entities/staff.entity';
import { TokenDenylistService } from './token-denylist.service';
import { LoginLockoutService } from './login-lockout.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Staff]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, JwtService, TokenDenylistService, LoginLockoutService],
  exports: [AuthService, JwtAuthGuard, JwtService, TokenDenylistService, LoginLockoutService, TypeOrmModule],
})
export class AuthModule {}
