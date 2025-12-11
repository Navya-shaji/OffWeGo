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
import { StripeService } from "../../Services/stripeService";
import { SubscriptionPlanRepository } from "../../../adapters/repository/Subscription/subscriptionRepo";
import { cancelBookingUsecase } from "../../../useCases/booking/CancelBookingUSecase";
import { CreateUserWalletUsecase } from "../../../useCases/wallet/createUserWalletUsecase";
import { WalletController } from "../../../adapters/controller/Wallet/Walletcontroller";
import { WalletRepository } from "../../../adapters/repository/Wallet/walletRepository";
import { GetUserWalletUsecase } from "../../../useCases/wallet/getusewalletUsecase";
import { ForgotPassUsecase } from "../../../useCases/user/Login/forgotPassUSecase";
// import { SendNotificationUseCase } from "../../../useCases/notifications/SendNotificationUsecase";
// import { FirebaseNotificationService } from "../../Services/FirebaseNotificationService";
// import { NotificationController } from "../../../adapters/controller/Notifications/NotificationController";
// import { NotificationRepository } from "../../../adapters/repository/Notification/NotificationRepo";
// import { ChatRepository } from "../../../adapters/repository/Chat/chatRepository";
import { TransferAmountUseCase } from "../../../useCases/wallet/transferWalletUsecase";
import { GetCompletedBookingsForTransfer } from "../../../useCases/wallet/getcompletedBookingUSecase";
import { SubscriptionBookingRepository } from "../../../adapters/repository/Booking/subscriptionBookingRepo";
import { UserProfileController } from "../../../adapters/controller/User/userProfileController";
import { SubscriptionPaymentController } from "../../../adapters/controller/Subscriptionplan/subscriptionPaymentController";
import { BookingRescheduleUseCase } from "../../../useCases/booking/BookingResheduleUsecase";
import { ChatRepository } from "../../../adapters/repository/Chat/chatRepository";
import { GetChatsOfUserUsecase } from "../../../useCases/chat/GetChatUSecase";
import { ChatController } from "../../../adapters/controller/chat/ChatController";
import { WalletPaymentUseCase } from "../../../useCases/wallet/walletPayment";
import { NotificationController } from "../../../adapters/controller/Notifications/NotificationController";
import { GetNotificationUseCase } from "../../../useCases/notifications/GetNotificationusecase";
import { NotificationRepository } from "../../../adapters/repository/Notification/NotificationRepo";
import { SendNotificationUseCase } from "../../../useCases/notifications/SendNotificationUsecase";
import { FirebaseNotificationService } from "../../Services/FirebaseNotificationService";
import { VendorRepository } from "../../../adapters/repository/Vendor/VendorRepository";
import { PackageRepository } from "../../../adapters/repository/Package/PackageRepository";
import { ReadNotificationusecase } from "../../../useCases/notifications/ReadNotificationusecase";
import { CompleteTripUseCase } from "../../../useCases/wallet/completedTripUsecase";
import { MessageRepository } from "../../../adapters/repository/Msg/MessageRepository";
// import { GetMessagesUsecase } from "../../../useCases/msg/getMessageUsecase";
import { MarkMessagesSeenUseCase } from "../../../useCases/chat/MarkMessageusecase";
import { GetMessagesUseCase } from "../../../useCases/msg/getMessageUsecase";
import { InitiateChatUsecase } from "../../../useCases/chat/SendChatUSecase";
// import { ChatController } from "../../../adapters/controller/chat/ChatController";
// import { GetNotificationUseCase } from "../../../useCases/notifications/GetNotificationusecase";


// Setup Repos and Services
const userRepository = new UserRepository();
const authRepository=new AuthRepository()
const vendorRepo=new VendorRepository()
const otpService = new OtpService();
const hashPassword=new HashPassword();
const jwtService=new JwtService
const bookingRepo=new BookingRepository()
const stripeService = new StripeService();
const reviewRepo=new ReviewRepository()
const paymentRepo=new PaymentRepository(stripeService)
const subscriptionRepo=new SubscriptionPlanRepository()
const walletRepo=new WalletRepository()
const notificationRepo=new NotificationRepository()
const packageRepo=new PackageRepository()
const notificationservice=new FirebaseNotificationService(notificationRepo,userRepository,vendorRepo,)
const subscriptionbookingRepo=new SubscriptionBookingRepository()
const chatRepo=new ChatRepository()
const msgRepo=new MessageRepository()


// Use Cases
const registerUsecase = new RegisterUserUseCase(userRepository, otpService);
const googleSignupUseCase = new GoogleSignupUseCase(authRepository,userRepository);
const verifyOtpUsecase = new VerifyOtpUseCase(otpService,hashPassword,userRepository);
const loginUserUseCase=new UserLoginUseCase(userRepository,hashPassword,jwtService);
const resetPasswordUseCase=new ResetPasswordUseCase(userRepository,hashPassword);
const userprofile=new UserProfileUsecase(userRepository);
const resendotpusecase=new ResendOtpUsecase(otpService);
const edituserProfile=new EditUserProfile()
const createbookingusecase=new CreateBookingUseCase(bookingRepo,walletRepo,packageRepo,notificationservice)
const createpaymentusecase=new CreatePaymentUsecase(paymentRepo)
const userbookings=new GetUserBookingUsecase(bookingRepo)
const vendorsidebookings=new GetVendorSideBookingUsecase(bookingRepo)
const bookingdateusecase=new BookingDateUsecase(bookingRepo)
const createReviewusecase=new CreateReviewUseCase(reviewRepo,packageRepo,notificationservice)
const getReviewsUsecase=new GetReviewUsecase(reviewRepo)
const changepasswordusecase=new ChangePasswordUseCase(userRepository)
const verifypaymentusecase = new VerifyPaymentUseCase(
  stripeService,
  subscriptionRepo,
  subscriptionbookingRepo
);
const cancelbookingusecase=new cancelBookingUsecase(bookingRepo,walletRepo,packageRepo,notificationservice)
const createwalletusecase=new CreateUserWalletUsecase(walletRepo)
const getUserWalletusecase=new GetUserWalletUsecase(walletRepo)
const forgotPassUsecase=new ForgotPassUsecase(userRepository)
const notificationUsecase=new SendNotificationUseCase(notificationservice)
const sendchatusecase = new InitiateChatUsecase(chatRepo,bookingRepo)
const getchatusecase = new GetChatsOfUserUsecase(chatRepo)
const transferamountusecase=new TransferAmountUseCase(walletRepo)
const completedbookings=new GetCompletedBookingsForTransfer(bookingRepo)
const getNotificationusecase=new GetNotificationUseCase(notificationservice)
const reshedulebookingusecase=new BookingRescheduleUseCase(bookingRepo,packageRepo,notificationservice)
const walletpaymentusecase=new WalletPaymentUseCase(walletRepo)
const readnotificationusecase=new ReadNotificationusecase(notificationRepo)
const completedTripusecase=new CompleteTripUseCase(walletRepo,bookingRepo,packageRepo)
const getmessagesusecase = new GetMessagesUseCase(msgRepo)
const markmessagesseenusecase = new MarkMessagesSeenUseCase(msgRepo)
// const walletpaymentusecase=new walletpaymentusecase()

// Controllers
export const userRegisterController = new UserRegisterController(registerUsecase,verifyOtpUsecase,resendotpusecase,jwtService);
export const userLoginController =new UserLoginController(loginUserUseCase,jwtService,otpService,resetPasswordUseCase,forgotPassUsecase);
export const googleSignupController=new GoogleSignupController(googleSignupUseCase,jwtService);
export const userprofileController=new UserProfileController(userprofile,edituserProfile,changepasswordusecase);
export const bookingcontroller=new BookingController(createbookingusecase,userbookings,vendorsidebookings,bookingdateusecase,cancelbookingusecase,reshedulebookingusecase)
export const paymentcontroller=new PaymentController(createpaymentusecase)
export const reviewcontroller=new ReviewController(createReviewusecase,getReviewsUsecase)
export const subscriptionpaymentcontroller=new SubscriptionPaymentController(verifypaymentusecase)
export const walletcontroller=new WalletController(createwalletusecase,getUserWalletusecase,transferamountusecase,completedbookings,walletpaymentusecase,completedTripusecase)
export const notificationcontroller=new NotificationController(notificationUsecase,getNotificationusecase,readnotificationusecase)
export const chatcontroller=new ChatController(sendchatusecase, getchatusecase, getmessagesusecase, markmessagesseenusecase)
