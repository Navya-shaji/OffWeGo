export interface IOtpService {
  generateOtp(length?: number): string;
  storeOtp(email: string, otp: string): Promise<void>;
  verifyOtp(email: string, otp: string): Promise<boolean>;
}
