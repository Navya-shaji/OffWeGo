import { RegisterUserUseCase } from "../../../useCases/user/Signup/signupUserUsecase";
import { UserRegisterController } from "../../../adapters/controller/user/UserAuthentication";
import { UserRepository } from "../../../adapters/repository/user/userRepository";
import { OtpService } from "../../services/otpService";
import { VerifyOtpUseCase } from "../../../useCases/user/Signup/VerifyOtpUseCase";
import { UserVerifyOtpController } from "../../../adapters/controller/user/userVerifyOtp";
import { HashPassword } from "../../services/hashPassword";
import { UserLoginController } from "../../../adapters/controller/user/loginController";
import { UserLoginUseCase } from "../../../useCases/user/Login/LoginUserUseCase";
import {AuthRepository} from '../../../adapters/repository/user/authRepository'
import { GoogleSignupController } from "../../../adapters/controller/user/authController";
import { GoogleSignupUseCase } from "../../../useCases/user/Signup/signupWithGoogle";
import { VerifyResetOtpController } from "../../../adapters/controller/user/VerifyingOtp";
import { forgotPasswordController } from "../../../adapters/controller/user/forgotPasswordController";
import { UserResetPasswordController } from "../../../adapters/controller/user/resetPasswordController";
import { ResetPasswordUseCase } from "../../../useCases/user/Login/ResetPasswordUseCase";
import { JwtSevice } from "../../services/jwtService";



// Setup Repos and Services
const userRepository = new UserRepository();
const authRepository=new AuthRepository()
const otpService = new OtpService();
const hashPassword=new HashPassword()
const jwtService=new JwtSevice


// Use Cases
const registerUsecase = new RegisterUserUseCase(userRepository, otpService);
const googleSignupUseCase = new GoogleSignupUseCase(authRepository,userRepository);
const verifyOtpUsecase = new VerifyOtpUseCase(otpService,hashPassword,userRepository);
const loginUserUseCase=new UserLoginUseCase(userRepository,hashPassword,jwtService)
const resetPasswordUseCase=new ResetPasswordUseCase(userRepository,hashPassword)


// Controllers
export const userRegisterController = new UserRegisterController(registerUsecase);
export const verifyOtpController = new UserVerifyOtpController(verifyOtpUsecase);
export const userLoginController =new UserLoginController(loginUserUseCase);
export const googleSignupController=new GoogleSignupController(googleSignupUseCase);
export const verifyingOtpController = new VerifyResetOtpController(otpService);
export const forgotpassController = new forgotPasswordController(otpService);
export const resetPasswordController=new UserResetPasswordController(resetPasswordUseCase)
