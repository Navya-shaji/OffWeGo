import { RegisterUserUseCase } from "../../../useCases/user/Signup/SignupUserUsecase";
import { UserRegisterController } from "../../../adapters/controller/user/UserAuthentication";
import { UserRepository } from "../../../adapters/repository/User/UserRepository";
import { OtpService } from "../../Services/otpService";
import { VerifyOtpUseCase } from "../../../useCases/user/Signup/VerifyOtpUseCase";
import { HashPassword } from "../../Services/hashPassword";
import { UserLoginController } from "../../../adapters/controller/user/UserLoginController";
import { UserLoginUseCase } from "../../../useCases/user/Login/LoginUserUseCase";
import {AuthRepository} from '../../../adapters/repository/User/AuthRepository'
import { GoogleSignupController } from "../../../adapters/controller/user/AuthController";
import { GoogleSignupUseCase } from "../../../useCases/user/Signup/SignupWithGoogle";
import { ResetPasswordUseCase } from "../../../useCases/user/Login/ResetPasswordUseCase";
import { DestinationRepository } from "../../../adapters/repository/Destination/DestinationRepository";
import { UserProfileUsecase } from "../../../useCases/user/profile/CreateProfileUsecase";
import { UserProfileController } from "../../../adapters/controller/user/UserProfileController";
import { JwtService } from "../../Services/jwtService";
import { ResendOtpUsecase } from "../../../useCases/user/Signup/ResendOtpUsecase";
import { PackageController } from "../../../adapters/repository/Destination/GetPackageByDestinationController";
import { GetPackageUsecase } from "../../../useCases/destination/GetPackageByDestinationUsecase";
import { PackageRepository } from "../../../adapters/repository/Package/PackageRepository";
import { EditUserProfile } from "../../../useCases/user/profile/EditProfileUsecase";
import { CreateBooking } from "../../../useCases/booking/BookingUsecase";
import { BookingController } from "../../../adapters/controller/Booking/BookingController";
import { BookingRepository } from "../../../adapters/repository/Booking/BookingRepository";
import { model } from "mongoose";

// Setup Repos and Services
const userRepository = new UserRepository();
const authRepository=new AuthRepository()
const otpService = new OtpService();
const hashPassword=new HashPassword();
const destinationRepository=new DestinationRepository();
const jwtService=new JwtService
const packageRepo=new PackageRepository();
const bookingRepo=new BookingRepository()


// Use Cases
const registerUsecase = new RegisterUserUseCase(userRepository, otpService);
const googleSignupUseCase = new GoogleSignupUseCase(authRepository,userRepository);
const verifyOtpUsecase = new VerifyOtpUseCase(otpService,hashPassword,userRepository);
const loginUserUseCase=new UserLoginUseCase(userRepository,hashPassword,jwtService);
const resetPasswordUseCase=new ResetPasswordUseCase(userRepository,hashPassword);
const userprofile=new UserProfileUsecase(userRepository);
const resendotpusecase=new ResendOtpUsecase(otpService);
const getpackagebydestinationusecase=new GetPackageUsecase(packageRepo);
const edituserProfile=new EditUserProfile()
const createbookingusecase=new CreateBooking(bookingRepo)


// Controllers
export const userRegisterController = new UserRegisterController(registerUsecase,verifyOtpUsecase,resendotpusecase);
export const userLoginController =new UserLoginController(loginUserUseCase,jwtService,otpService,resetPasswordUseCase);
export const googleSignupController=new GoogleSignupController(googleSignupUseCase,jwtService);
export const userprofileController=new UserProfileController(userprofile,edituserProfile);
export const getpackageByDestinationController=new PackageController(getpackagebydestinationusecase);
export const bookingcontroller = new BookingController(createbookingusecase);
