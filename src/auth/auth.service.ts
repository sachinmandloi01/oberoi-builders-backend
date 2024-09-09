// src/auth/auth.service.ts
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { OtpService } from '../user/otp.service';
import { JwtPayload } from './jwt-payload.interface';
import { Twilio } from 'twilio';
import axios, { AxiosResponse } from 'axios';
@Injectable()
export class AuthService {
  private readonly apiUrl =
    'https://kqd6y1.api.infobip.com/sms/2/text/advanced';
  private twilioClient: Twilio;
  constructor(
    private readonly userService: UserService,
    private readonly otpService: OtpService,
    private readonly jwtService: JwtService,
  ) {
    this.twilioClient = new Twilio(
      process.env.TWILIO_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload: JwtPayload = { email: user.email, id: user._id };
    return {
      access_token: this.jwtService.sign(payload),
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.userRole,
      address: user.address,
    };
  }
  async sendOtp(mobile: string): Promise<{ otp: string }> {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    await this.otpService.saveOtp(mobile, '1234');
    try {
      // const data = {
      //   messages: [
      //     {
      //       destinations: [{ to: '+919669563039' }],
      //       from: '447491163443',
      //       text: 'Congratulations on sending your first message.\nGo ahead and check the delivery report in the next step.',
      //     },
      //   ],
      // };
      // const config = {
      //   headers: {
      //     Authorization:
      //       'App 9e36e54dc3498fa1bbea1de746e12921-5792ce35-82d1-40f3-b220-fa09f08019f4',
      //     'Content-Type': 'application/json',
      //     Accept: 'application/json',
      //   },
      // };
      // const response = await axios.post(
      //   'https://kqd6y1.api.infobip.com/sms/2/text/advanced',
      //   data,
      //   config,
      // );
      // console.log(response.data);
      // console.log(JSON.stringify(response.data, null, 2));
      return {
        otp: '1234',
      };
    } catch (error) {
      // Handle errors
      throw new HttpException(
        `Failed to post data: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    // await this.twilioClient.messages.create({
    //   body: `Your OTP is ${otp}`,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   to: mobile,
    // });
  }

  async verifyOtp(mobile: string, otp: string): Promise<{ sub: string }> {
    const isValidOtp = await this.otpService.verifyOtp(mobile, otp);
    if (!isValidOtp) {
      throw new HttpException(`Invalid OTP`, HttpStatus.BAD_REQUEST);
    }

    let user = await this.userService.findByMobile(mobile);
    if (!user) {
      user = await this.userService.createUser({ mobile });
    }

    const payload = { sub: user._id.toString() };
    return payload;
    // return this.jwtService.sign(payload);
  }
}
