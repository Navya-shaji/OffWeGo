import { IUserRepository } from "../../../domain/interface/userRepository/IuserRepository";
import { IOtpService } from "../../../domain/interface/serviceInterface/Iotpservice";
import { RegisterDTO } from "../../../domain/dto/user/userDto";
import { IregisterUserUseCase } from "../../../domain/interface/usecaseInterface/IusecaseInterface";

export class RegisterUserUseCase implements IregisterUserUseCase {
  private _userRepository: IUserRepository;
  private _otpService: IOtpService;
  constructor(userRepository: IUserRepository, otpService: IOtpService) {
    this._userRepository = userRepository;
    this._otpService = otpService;
  }

  async execute(userInput: RegisterDTO): Promise<boolean> {
    const { name, email, password, phone } = userInput;

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
