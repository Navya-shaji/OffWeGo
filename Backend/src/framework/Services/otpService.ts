import { IOtpService } from "../../domain/interface/ServiceInterface/Iotpservice";
import Redis from "ioredis";
import nodemailer from "nodemailer";
import NodeCache from "node-cache";

export class OtpService implements IOtpService {
  private redis: Redis;
  private localCache: NodeCache;
  private useLocalCache: boolean = false;

  constructor() {
    this.localCache = new NodeCache({ stdTTL: 60 }); // 60 seconds default TTL for OTP

    this.redis = new Redis({
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      maxRetriesPerRequest: 1,
      lazyConnect: true, // Don't connect until a command is sent
      retryStrategy: (times) => {
        if (times > 1) {
          if (!this.useLocalCache) {
            console.warn("⚠️ OtpService: Redis unavailable. Using In-Memory Cache (OTPs will still work).");
            this.useLocalCache = true;
          }
          return null;
        }
        return 50;
      }
    });

    this.redis.on("error", (err) => {
      // Only log errors if we haven't switched to local cache yet
      if (!this.useLocalCache) {
        // Silencing the common "ECONNREFUSED" to keep logs clean for dev
        if (err.message.includes("ECONNREFUSED")) return;
        console.error("Redis error in OtpService:", err.message);
      }
    });

    this.redis.on("connect", () => {
      console.log("✅ Redis connected in OtpService");
      this.useLocalCache = false;
    });
  }

  generateOtp(length: number = 6): string {
    let otp = "";
    for (let i = 0; i < length; i++) {
      otp += Math.floor(Math.random() * 10);
    }
    console.log("Generated OTP:", otp);
    return otp;
  }

  async storeOtp(email: string, otp: string): Promise<void> {
    if (this.useLocalCache) {
      this.localCache.set(email, otp);
      return;
    }
    try {
      await this.redis.set(email, otp, "EX", 60);
    } catch {
      this.useLocalCache = true;
      this.localCache.set(email, otp);
    }
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    let storedOtp: string | undefined | null;

    if (this.useLocalCache) {
      storedOtp = this.localCache.get<string>(email);
    } else {
      try {
        storedOtp = await this.redis.get(email);
      } catch {
        this.useLocalCache = true;
        storedOtp = this.localCache.get<string>(email);
      }
    }

    if (!storedOtp || storedOtp !== otp) return false;

    if (this.useLocalCache) {
      this.localCache.del(email);
    } else {
      try {
        await this.redis.del(email);
      } catch {
        this.localCache.del(email);
      }
    }
    return true;
  }

  async resendOtp(email: string): Promise<void> {
    const otp = this.generateOtp();
    await this.storeOtp(email, otp);
    await this.sendOtpEmail(email, otp);
  }

  async sendOtpEmail(email: string, otp: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f8f9fc;
          }
          .popup-box {
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 20px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            text-align: center;
            padding: 30px;
          }
          .confetti {
            font-size: 32px;
            margin-bottom: 15px;
          }
          .title {
            font-size: 26px;
            font-weight: bold;
            color: #2b2e4a;
            margin: 0 0 10px;
          }
          .subtitle {
            font-size: 16px;
            color: #555;
            margin: 10px 0 20px;
          }
          .otp-box {
            background: #e3f2fd;
            border: 2px dashed #2196f3;
            border-radius: 12px;
            padding: 20px;
            margin: 20px auto;
            display: inline-block;
          }
          .otp {
            font-size: 36px;
            color: #0d47a1;
            letter-spacing: 10px;
            font-weight: bold;
          }
          .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #888;
          }
        </style>
      </head>
      <body>
        <div class="popup-box">
          <div class="confetti">🎉🎊✨</div>
          <div class="title">You're Almost There!</div>
          <div class="subtitle">Use the OTP below to complete your signup journey 🚀</div>

          <div class="otp-box">
            <div class="otp">${otp}</div>
          </div>

          <p style="color: #555;">This OTP is valid for <strong>1 minutes</strong>. Please don't share it with anyone.</p>

          <div class="footer">
            Need help? <a href="mailto:support@offwego.com">Contact Support</a><br/>
            &copy; ${new Date().getFullYear()} OffWeGo. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"OffWeGo" <${process.env.NODEMAILER_EMAIL}>`,
      to: email,
      subject: "Your OffWeGo OTP Code",
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(info)
  }
}
