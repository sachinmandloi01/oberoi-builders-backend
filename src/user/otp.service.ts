import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Otp, OtpDocument } from './schemas/otp.schema';

@Injectable()
export class OtpService {
  constructor(@InjectModel(Otp.name) private otpModel: Model<OtpDocument>) {}

  async saveOtp(mobile: string, otp: string): Promise<Otp> {
    const otpEntry = new this.otpModel({ mobile, otp });
    return otpEntry.save();
  }

  async verifyOtp(mobile: string, otp: string): Promise<boolean> {
    const otpEntry = await this.otpModel.findOne({ mobile, otp }).exec();
    if (!otpEntry) return false;

    // Optionally delete OTP after verification
    await this.otpModel.deleteOne({ _id: otpEntry._id }).exec();
    return true;
  }
}
