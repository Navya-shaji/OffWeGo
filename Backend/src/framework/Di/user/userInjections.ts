import { RegisterUserUseCase } from "../../../useCases/user/Signup/signupUserUsecase"; 
import { UserRegisterController } from "../../../adapters/controller/User/UserAuthentication"; 
import { UserRepository } from "../../../adapters/repository/User/UserRepository";  
import { OtpService } from "../../Services/otpService";
import { VerifyOtpUseCase } from "../../../useCases/user/Signup/VerifyOtpUseCase";
import { HashPassword } from "../../Services/hashPassword";
import { UserLoginController } from "../../../adapters/controller/User/UserLoginController"; 
import { UserLoginUseCase } from "../../../useCases/user/Login/LoginUserUseCase";
import { AuthRepository } from "../../../adapters/repository/User/AuthRepository"; 
import { GoogleSignupController } from "../../../adapters/controller/User/AuthController";
import { GoogleSignupUseCase } from "../../../useCases/user/Signup/signupWithGoogle"; 
import { ResetPasswordUseCase } from "../../../useCases/user/Login/ResetPasswordUseCase";
import { UserProfileUsecase } from "../../../useCases/user/profile/createProfileUsecase"; 
import { UserProfileController } from "../../../adapters/controller/User/UserProfileController"; 
import { JwtService } from "../../Services/jwtService";
import { ResendOtpUsecase } from "../../../useCases/user/Signup/resendOtpUsecase";
import { EditUserProfile } from "../../../useCases/user/profile/EditProfileUsecase";
import { CreateBookingUseCase } from "../../../useCases/booking/CreateBookingUsecase";
import { BookingRepository } from "../../../adapters/repository/Booking/BookingRepository";
import { BookingController } from "../../../adapters/controller/Booking/BookingController";
import { CreatePaymentUsecase } from "../../../useCases/payment/CreatePaymentusecase";
import { PaymentRepository } from "../../../adapters/repository/Payment/PaymentRepository";
import { PaymentController } from "../../../adapters/controller/Payment/PaymentController"; 
import { GetUserBookingUsecase } from "../../../useCases/booking/GetUserBokingsUsecase";
import { GetVendorSideBookingUsecase } from "../../../useCases/booking/GetVendorSideBookingUsecase";
import { BookingDateUsecase } from "../../../useCases/booking/BookingDatesUsecase";
import { ReviewController } from "../../../adapters/controller/Reviews/ReviewController";
import { ReviewRepository } from "../../../adapters/repository/Reviews/ReviewRepository";
import { CreateReviewUseCase } from "../../../useCases/reviews/createReviewUsecase";
import { GetReviewUsecase } from "../../../useCases/reviews/getAllReviewsUsecase";
import { ChangePasswordUseCase } from "../../../useCases/user/profile/changePasswordUsecase";
import { VerifyPaymentUseCase } from "../../../useCases/subscription/VerifyPaymentUsecase";
import { SubscriptionPaymentController } from "../../../adapters/controller/Subscriptionplan/subscriptionPaymentController";
import { StripeService } from "../../Services/stripeService";
import { SubscriptionPlanRepository } from "../../../adapters/repository/Subscription/subscriptionRepo";
import { cancelBookingUsecase } from "../../../useCases/booking/CancelBookingUSecase";


// Setup Repos and Services
const userRepository = new UserRepository();
const authRepository=new AuthRepository()
const otpService = new OtpService();
const hashPassword=new HashPassword();
const jwtService=new JwtService
const bookingRepo=new BookingRepository()
const stripeService = new StripeService();
const reviewRepo=new ReviewRepository()
const paymentRepo=new PaymentRepository(stripeService)
const subscriptionRepo=new SubscriptionPlanRepository()


// Use Cases
const registerUsecase = new RegisterUserUseCase(userRepository, otpService);
const googleSignupUseCase = new GoogleSignupUseCase(authRepository,userRepository);
const verifyOtpUsecase = new VerifyOtpUseCase(otpService,hashPassword,userRepository);
const loginUserUseCase=new UserLoginUseCase(userRepository,hashPassword,jwtService);
const resetPasswordUseCase=new ResetPasswordUseCase(userRepository,hashPassword);
const userprofile=new UserProfileUsecase(userRepository);
const resendotpusecase=new ResendOtpUsecase(otpService);
const edituserProfile=new EditUserProfile()
const createbookingusecase=new CreateBookingUseCase(bookingRepo)
const createpaymentusecase=new CreatePaymentUsecase(paymentRepo)
const userbookings=new GetUserBookingUsecase(bookingRepo)
const vendorsidebookings=new GetVendorSideBookingUsecase(bookingRepo)
const bookingdateusecase=new BookingDateUsecase(bookingRepo)
const createReviewusecase=new CreateReviewUseCase(reviewRepo)
const getReviewsUsecase=new GetReviewUsecase(reviewRepo)
const changepasswordusecase=new ChangePasswordUseCase(userRepository)
const verifypaymentusecase=new VerifyPaymentUseCase(stripeService,subscriptionRepo)
const cancelbookingusecase=new cancelBookingUsecase(bookingRepo,userRepository)



// Controllers
export const userRegisterController = new UserRegisterController(registerUsecase,verifyOtpUsecase,resendotpusecase,jwtService);
export const userLoginController =new UserLoginController(loginUserUseCase,jwtService,otpService,resetPasswordUseCase);
export const googleSignupController=new GoogleSignupController(googleSignupUseCase,jwtService);
export const userprofileController=new UserProfileController(userprofile,edituserProfile,changepasswordusecase);
export const bookingcontroller=new BookingController(createbookingusecase,userbookings,vendorsidebookings,bookingdateusecase,cancelbookingusecase)
export const paymentcontroller=new PaymentController(createpaymentusecase)
export const reviewcontroller=new ReviewController(createReviewusecase,getReviewsUsecase)
export const subscriptionpaymentcontroller=new SubscriptionPaymentController(verifypaymentusecase)
