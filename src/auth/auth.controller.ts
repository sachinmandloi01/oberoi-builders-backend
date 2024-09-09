// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  //sachin @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: any) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.authService.login(user);
  }
  @Post('send-otp')
  async sendOtp(@Body('mobile') mobile: string): Promise<void> {
    await this.authService.sendOtp(mobile);
  }

  @Post('verify-otp')
  async verifyOtp(
    @Body('mobile') mobile: string,
    @Body('otp') otp: string,
  ): Promise<{ sub: string }> {
    const accessToken = await this.authService.verifyOtp(mobile, otp);
    return accessToken;
  }
}
