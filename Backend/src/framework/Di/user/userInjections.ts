import { RegisterUserUseCase } from "../../../useCases/user/Signup/signupUserUsecase"; 
import { UserRegisterController } from "../../../adapters/controller/User/UserAuthentication"; 
import { UserRepository } from "../../../adapters/repository/User/userRepository";  
import { OtpService } from "../../Services/otpService";
import { VerifyOtpUseCase } from "../../../useCases/user/Signup/VerifyOtpUseCase";
import { HashPassword } from "../../Services/hashPassword";
import { UserLoginController } from "../../../adapters/controller/User/UserLoginController"; 
import { UserLoginUseCase } from "../../../useCases/user/Login/LoginUserUseCase";
import { AuthRepository } from "../../../adapters/repository/User/authRepository"; 
import { GoogleSignupController } from "../../../adapters/controller/User/authController";
import { GoogleSignupUseCase } from "../../../useCases/user/Signup/signupWithGoogle"; 
import { ResetPasswordUseCase } from "../../../useCases/user/Login/ResetPasswordUseCase";
import { UserProfileUsecase } from "../../../useCases/user/profile/createProfileUsecase"; 
import { UserProfileController } from "../../../adapters/controller/User/userProfileController"; 
import { JwtService } from "../../Services/jwtService";
import { ResendOtpUsecase } from "../../../useCases/user/Signup/resendOtpUsecase";

import { EditUserProfile } from "../../../useCases/user/profile/EditProfileUsecase";
import { CreateBookingUseCase } from "../../../useCases/Booking/CreateBookingUsecase";
import { BookingRepository } from "../../../adapters/repository/Booking/BookingRepository";
import { BookingController } from "../../../adapters/controller/Booking/BookingController";
import { CreatePaymentUsecase } from "../../../useCases/Payment/CreatePaymentusecase";
import { PaymentRepository } from "../../../adapters/repository/Payment/PaymentRepository";
import { PaymentController } from "../../../adapters/controller/Payment/PaymentController"; 
import { GetUserBookingUsecase } from "../../../useCases/Booking/GetUserBokingsUsecase";
import { StripeService } from "../../Services/stripeService";


// Setup Repos and Services
const userRepository = new UserRepository();
const authRepository=new AuthRepository()
const otpService = new OtpService();
const hashPassword=new HashPassword();
const jwtService=new JwtService
const bookingRepo=new BookingRepository()
const stripeService = new StripeService();
// const packageRepo=new PackageRepository();
const paymentRepo=new PaymentRepository(stripeService)



// Use Cases
const registerUsecase = new RegisterUserUseCase(userRepository, otpService);
const googleSignupUseCase = new GoogleSignupUseCase(authRepository,userRepository);
const verifyOtpUsecase = new VerifyOtpUseCase(otpService,hashPassword,userRepository);
const loginUserUseCase=new UserLoginUseCase(userRepository,hashPassword,jwtService);
const resetPasswordUseCase=new ResetPasswordUseCase(userRepository,hashPassword);
const userprofile=new UserProfileUsecase(userRepository);
const resendotpusecase=new ResendOtpUsecase(otpService);
// const getpackagebydestinationusecase=new GetPackageUsecase(packageRepo);
const edituserProfile=new EditUserProfile()
const createbookingusecase=new CreateBookingUseCase(bookingRepo)
const createpaymentusecase=new CreatePaymentUsecase(paymentRepo)
const userbookings=new GetUserBookingUsecase(bookingRepo)



// Controllers
export const userRegisterController = new UserRegisterController(registerUsecase,verifyOtpUsecase,resendotpusecase,jwtService);
export const userLoginController =new UserLoginController(loginUserUseCase,jwtService,otpService,resetPasswordUseCase);
export const googleSignupController=new GoogleSignupController(googleSignupUseCase,jwtService);
export const userprofileController=new UserProfileController(userprofile,edituserProfile);
export const bookingcontroller=new BookingController(createbookingusecase,userbookings)
// export const getpackageByDestinationController=new PackageController(getpackagebydestinationusecase);
export const paymentcontroller=new PaymentController(createpaymentusecase)
