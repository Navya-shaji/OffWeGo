import { RegisterUserUseCase } from "../../../useCases/user/Signup/signupUserUsecase";
import { UserRegisterController } from "../../../adapters/controller/user/UserAuthentication";
import { UserRepository } from "../../../adapters/repository/user/userRepository";
import { OtpService } from "../../services/otpService";
import { VerifyOtpUseCase } from "../../../useCases/user/Signup/VerifyOtpUseCase";
import { HashPassword } from "../../services/hashPassword";
import { UserLoginController } from "../../../adapters/controller/user/UserLoginController";
import { UserLoginUseCase } from "../../../useCases/user/Login/LoginUserUseCase";
import {AuthRepository} from '../../../adapters/repository/user/AuthRepository'
import { GoogleSignupController } from "../../../adapters/controller/user/AuthController";
import { GoogleSignupUseCase } from "../../../useCases/user/Signup/signupWithGoogle";
import { ResetPasswordUseCase } from "../../../useCases/user/Login/ResetPasswordUseCase";
import { DestinationRepository } from "../../../adapters/repository/Destination/DestinationRepository";
import { UserProfileUsecase } from "../../../useCases/user/profile/createProfileUsecase";
import { UserProfileController } from "../../../adapters/controller/user/userProfileController";
import { JwtService } from "../../services/jwtService";
import { ResendOtpUsecase } from "../../../useCases/user/Signup/resendOtpUsecase";
import { PackageController } from "../../../adapters/repository/Destination/getPackageByDestinationController";
import { GetPackageUsecase } from "../../../useCases/Destination/GetPackageByDestinationUsecase";
import { PackageRepository } from "../../../adapters/repository/package/PackageRepository";
import { EditUserProfile } from "../../../useCases/user/profile/EditProfileUsecase";
import { CreateBooking } from "../../../useCases/Booking/BookingUsecase";
import { BookingController } from "../../../adapters/controller/Booking/BookingController";
import { BookingRepository } from "../../../adapters/repository/Booking/BookingRepository";

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
