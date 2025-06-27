import { IOtpService } from "../../domain/interface/serviceInterface/Iotpservice";
import Redis from "ioredis";

export class OtpService implements IOtpService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || "127.0.0.1",   
      port: Number(process.env.REDIS_PORT) || 6379,    
      password: process.env.REDIS_PASSWORD || undefined,
    });
  }
  generateOtp(length: number = 6): string {
    let otp = "";
    for (let i = 0; i < length; i++) {
      otp += Math.floor(Math.random() * 10);
    }
    console.log(otp)
    return otp;
  }
  async storeOtp(email: string, otp: string): Promise<void> {
    await this.redis.set(email, otp, "EX", 300);
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const storedOtp = await this.redis.get(email);
    if (!storedOtp || storedOtp !== otp) return false;

    await this.redis.del(email);
    return true;
  }
}
