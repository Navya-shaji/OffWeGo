import { RegisterUserUseCase } from "../../../useCases/user/Signup/signupUserUsecase";
import { UserRegisterController } from "../../../adapters/controller/user/UserAuthentication";
import { UserRepository } from "../../../adapters/repository/user/userRepository";
import { OtpService } from "../../services/otpService";
import { VerifyOtpUseCase } from "../../../useCases/user/Signup/VerifyOtpUseCase";
import { UserVerifyOtpController } from "../../../adapters/controller/user/userVerifyOtp";
import { HashPassword } from "../../services/hashPassword";

// Setup Repos and Services
const userRepository = new UserRepository();
const otpService = new OtpService();
const hashPassword=new HashPassword()
// Use Cases
const registerUsecase = new RegisterUserUseCase(userRepository, otpService);
const verifyOtpUsecase = new VerifyOtpUseCase(otpService,hashPassword,userRepository);

// Controllers
export const userRegisterController = new UserRegisterController(registerUsecase);
export const verifyOtpController = new UserVerifyOtpController(verifyOtpUsecase);