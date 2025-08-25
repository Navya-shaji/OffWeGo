import { User } from "../../../domain/entities/userEntity";
import { IPasswordService } from "../../../domain/interface/serviceInterface/IhashpasswordService";
import { IOtpService } from "../../../domain/interface/serviceInterface/Iotpservice";
import { IUserRepository } from "../../../domain/interface/userRepository/IuserRepository";


export class VerifyOtpUseCase {
  private _hashService: IPasswordService;
  private _otpService: IOtpService;
  private _userRepository: IUserRepository;
  constructor(
    otpService: IOtpService,
    hashService: IPasswordService,
    userRepository: IUserRepository
  ) {
    (this._hashService = hashService),
      (this._otpService = otpService),
      (this._userRepository = userRepository);
  }

  async execute(userData: User, otp: string): Promise<User> {
    const isVerified = await this._otpService.verifyOtp(userData.email, otp);
    if (!isVerified) throw new Error("Invalid or expired OTP");
    const hashPassword = await this._hashService.hashPassword(userData.password);
    const user = this._userRepository.createUser({
      ...userData,
      password: hashPassword,
    });
    return user;
  }
}
