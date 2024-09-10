// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { OtpService } from '../user/otp.service'; // Import OtpService
import { Otp, OtpSchema } from '../user/schemas/otp.schema'; // Import Otp schema
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the config globally available
    }),
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Change this to a secure key
      signOptions: { expiresIn: process.env.EXP_IN },
    }),
    MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema }]),
  ],
  providers: [AuthService, JwtStrategy, OtpService],
  controllers: [AuthController],
})
export class AuthModule {}
