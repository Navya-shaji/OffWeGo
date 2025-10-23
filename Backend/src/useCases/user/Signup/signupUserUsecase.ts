import { IUserRepository } from "../../../domain/interface/UserRepository/IuserRepository";
import { IOtpService } from "../../../domain/interface/ServiceInterface/Iotpservice";
import { IregisterUserUseCase } from "../../../domain/interface/UsecaseInterface/IusecaseInterface";
import { UserDto } from "../../../domain/dto/User/UserDto";

export class RegisterUserUseCase implements IregisterUserUseCase {
  private _userRepository: IUserRepository;
  private _otpService: IOtpService;
  constructor(userRepository: IUserRepository, otpService: IOtpService) {
    this._userRepository = userRepository;
    this._otpService = otpService;
  }

  async execute(userInput: UserDto): Promise<boolean> {
    const {  email, phone } = userInput;

    const existingUser = await this._userRepository.findByEmail(email);

    if (existingUser) throw new Error("User Already exists");

    const existingPhoneNumber = await this._userRepository.findByPhone(
      phone.toString()
    );
    if (existingPhoneNumber) {
      throw new Error("Phone number already registered");
    }
    const otp = this._otpService.generateOtp();
    await this._otpService.storeOtp(email, otp);
    await this._otpService.sendOtpEmail(email, otp);
    return true;
  }
}
