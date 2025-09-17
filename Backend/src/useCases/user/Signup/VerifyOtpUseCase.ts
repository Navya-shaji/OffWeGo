import { User } from "../../../domain/entities/UserEntity";
import { IPasswordService } from "../../../domain/interface/ServiceInterface/IhashpasswordService";
import { IOtpService } from "../../../domain/interface/ServiceInterface/Iotpservice";
import { IUserRepository } from "../../../domain/interface/UserRepository/IuserRepository";


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
