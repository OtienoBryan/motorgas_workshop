import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('admin/login')
  async login(@Body() loginDto: LoginDto) {
    try {
      return await this.authService.login(loginDto);
    } catch (error) {
      console.error('❌ [AuthController] Login error:', error);
      // Re-throw the error - NestJS will handle it based on the exception type
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const staff = await this.authService.getStaffById(req.user.sub);
    if (!staff) {
      throw new Error('Staff not found');
    }

    return {
      id: staff.id,
      email: staff.business_email,
      firstName: staff.name.split(' ')[0] || staff.name,
      lastName: staff.name.split(' ').slice(1).join(' ') || '',
      role: staff.role,
    };
  }
}
