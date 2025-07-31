import { RegisterUserUseCase } from "../../../useCases/user/Signup/signupUserUsecase";
import { UserRegisterController } from "../../../adapters/controller/user/UserAuthentication";
import { UserRepository } from "../../../adapters/repository/user/userRepository";
import { OtpService } from "../../services/otpService";
import { VerifyOtpUseCase } from "../../../useCases/user/Signup/VerifyOtpUseCase";
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
import { GetAllDestinations } from "../../../useCases/Destination/getAllDestinationUsecase";
import { DestinationRepository } from "../../../adapters/repository/Destination/destinationRepository";
import { UserProfileUsecase } from "../../../useCases/user/profile/createProfileUsecase";
import { UserProfileController } from "../../../adapters/controller/user/userProfileController";
import { JwtSevice } from "../../services/jwtService";
import { GetDestination } from "../../../useCases/Destination/getDestinationDetailUsecase";
import { ResendOtpUsecase } from "../../../useCases/user/Signup/resendOtpUsecase";
import { PackageController } from "../../../adapters/repository/Destination/getPackageByDestinationController";
import { GetPackageUsecase } from "../../../useCases/Destination/GetPackageByDestinationUsecase";
import { PackageRepository } from "../../../adapters/repository/package/PackageRepository";
import { EditUserProfileController } from "../../../adapters/controller/user/EditProfileController"; 
import { EditUserProfile } from "../../../useCases/user/profile/EditProfileUsecase";


// Setup Repos and Services
const userRepository = new UserRepository();
const authRepository=new AuthRepository()
const otpService = new OtpService();
const hashPassword=new HashPassword();
const destinationRepository=new DestinationRepository();
const jwtService=new JwtSevice
const packageRepo=new PackageRepository()


// Use Cases
const registerUsecase = new RegisterUserUseCase(userRepository, otpService);
const googleSignupUseCase = new GoogleSignupUseCase(authRepository,userRepository);
const verifyOtpUsecase = new VerifyOtpUseCase(otpService,hashPassword,userRepository);
const loginUserUseCase=new UserLoginUseCase(userRepository,hashPassword,jwtService);
const resetPasswordUseCase=new ResetPasswordUseCase(userRepository,hashPassword);
const getallDestinations=new GetAllDestinations(destinationRepository);
const userprofile=new UserProfileUsecase(userRepository);
const getsingleDestinationusecase=new GetDestination(destinationRepository);
const resendotpusecase=new ResendOtpUsecase(otpService);
const getpackagebydestinationusecase=new GetPackageUsecase(packageRepo);
const edituserProfile=new EditUserProfile()


// Controllers
export const userRegisterController = new UserRegisterController(registerUsecase,verifyOtpUsecase,resendotpusecase);
export const userLoginController =new UserLoginController(loginUserUseCase,jwtService);
export const googleSignupController=new GoogleSignupController(googleSignupUseCase,jwtService);
export const verifyingOtpController = new VerifyResetOtpController(otpService);
export const forgotpassController = new forgotPasswordController(otpService);
export const resetPasswordController=new UserResetPasswordController(resetPasswordUseCase);
export const userprofileController=new UserProfileController(userprofile);
export const getpackageByDestinationController=new PackageController(getpackagebydestinationusecase);
export const getusereditProfile=new EditUserProfileController(edituserProfile);
