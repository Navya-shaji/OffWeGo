import { User } from "../../../domain/entities/userEntity";
import { IPasswordService } from "../../../domain/interface/serviceInterface/IhashpasswordService";
import { IOtpService } from "../../../domain/interface/serviceInterface/Iotpservice";
import { IUserRepository } from "../../../domain/interface/userRepository/IuserRepository";
import { HashPassword } from "../../../framework/services/hashPassword";

export class VerifyOtpUseCase {
  private hashService: IPasswordService;
  private otpService: IOtpService;
  private userRepository: IUserRepository;
  constructor(
    otpService: IOtpService,
    hashService: IPasswordService,
    userRepository: IUserRepository
  ) {
    (this.hashService = hashService),
      (this.otpService = otpService),
      (this.userRepository = userRepository);
  }

  async execute(userData: User, otp: string): Promise<User> {
    const isVerified = await this.otpService.verifyOtp(userData.email, otp);
    if (!isVerified) throw new Error("Invalid or expired OTP");
    const hashPassword = await this.hashService.hashPassword(userData.password);
    const user = this.userRepository.createUser({
      ...userData,
      password: hashPassword,
    });
    return user;
  }
}
