import { RegisterUserUseCase } from "../../../useCases/User/Signup/signupUserUsecase";
import { UserRegisterController } from "../../../adapters/controller/User/UserAuthentication";
import { UserRepository } from "../../../adapters/repository/User/UserRepository";
import { OtpService } from "../../Services/otpService";
import { VerifyOtpUseCase } from "../../../useCases/User/Signup/VerifyOtpUseCase";
import { HashPassword } from "../../Services/hashPassword";
import { UserLoginController } from "../../../adapters/controller/User/UserLoginController";
import { UserLoginUseCase } from "../../../useCases/User/Login/LoginUserUseCase";
import { AuthRepository } from "../../../adapters/repository/User/AuthRepository";
import { GoogleSignupController } from "../../../adapters/controller/User/authController";
import { UserProfileController } from "../../../adapters/controller/User/userProfileController";
import { GoogleSignupUseCase } from "../../../useCases/User/Signup/signupWithGoogle";
import { ResetPasswordUseCase } from "../../../useCases/User/Login/ResetPasswordUseCase";
import { UserProfileUsecase } from "../../../useCases/User/profile/createProfileUsecase";
import { JwtService } from "../../Services/jwtService";
import { ResendOtpUsecase } from "../../../useCases/User/Signup/resendOtpUsecase";
import { EditUserProfile } from "../../../useCases/User/profile/EditProfileUsecase";
import { CreateBookingUseCase } from "../../../useCases/Booking/CreateBookingUsecase";
import { BookingRepository } from "../../../adapters/repository/Booking/BookingRepository";
import { BookingController } from "../../../adapters/controller/Booking/BookingController";
import { CreatePaymentUsecase } from "../../../useCases/Payment/CreatePaymentusecase";
import { PaymentRepository } from "../../../adapters/repository/Payment/PaymentRepository";
import { PaymentController } from "../../../adapters/controller/Payment/PaymentController";
import { GetUserBookingUsecase } from "../../../useCases/Booking/GetUserBokingsUsecase";
import { GetVendorSideBookingUsecase } from "../../../useCases/Booking/GetVendorSideBookingUsecase";
import { BookingDateUsecase } from "../../../useCases/Booking/BookingDatesUsecase";
import { ReviewController } from "../../../adapters/controller/Reviews/ReviewController";
import { ReviewRepository } from "../../../adapters/repository/Reviews/ReviewRepository";
import { CreateReviewUseCase } from "../../../useCases/Reviews/createReviewUsecase";
import { GetReviewUsecase } from "../../../useCases/Reviews/getAllReviewsUsecase";
import { ChangePasswordUseCase } from "../../../useCases/User/profile/changePasswordUsecase";
import { VerifyPaymentUseCase } from "../../../useCases/Subscription/VerifyPaymentUsecase";
import { StripeService } from "../../Services/stripeService";
import { SubscriptionPlanRepository } from "../../../adapters/repository/Subscription/SubscriptionRepo";
import { cancelBookingUsecase } from "../../../useCases/Booking/CancelBookingUSecase";
import { CreateUserWalletUsecase } from "../../../useCases/Wallet/createUserWalletUsecase";
import { WalletController } from "../../../adapters/controller/Wallet/Walletcontroller";
import { WalletRepository } from "../../../adapters/repository/Wallet/WalletRepository";
import { GetUserWalletUsecase } from "../../../useCases/Wallet/getusewalletUsecase";
import { ForgotPassUsecase } from "../../../useCases/User/Login/forgotPassUSecase";
// import { SendNotificationUseCase } from "../../../useCases/notifications/SendNotificationUsecase";
// import { FirebaseNotificationService } from "../../Services/FirebaseNotificationService";
// import { NotificationController } from "../../../adapters/controller/Notifications/NotificationController";
// import { NotificationRepository } from "../../../adapters/repository/Notification/NotificationRepo";
// import { ChatRepository } from "../../../adapters/repository/Chat/chatRepository";
import { TransferAmountUseCase } from "../../../useCases/Wallet/transferWalletUsecase";
import { GetCompletedBookingsForTransfer } from "../../../useCases/Wallet/getcompletedBookingUSecase";
import { SubscriptionBookingRepository } from "../../../adapters/repository/Booking/SubscriptionBookingRepo";
import { GetAllBookingsUsecase } from "../../../useCases/Booking/GetAllBookingsUsecase";

import { SubscriptionPaymentController } from "../../../adapters/controller/Subscriptionplan/SubscriptionPaymentController";
import { BookingRescheduleUseCase } from "../../../useCases/Booking/BookingRescheduleUseCase";
import { ChatRepository } from "../../../adapters/repository/Chat/ChatRepository";
import { GetChatsOfUserUsecase } from "../../../useCases/Chat/GetChatUSecase";
import { ChatController } from "../../../adapters/controller/chat/ChatController";
import { InitiateChatUsecase } from "../../../useCases/Chat/SendChatUSecase";
import { WalletPaymentUseCase } from "../../../useCases/Wallet/walletPayment";
import { NotificationController } from "../../../adapters/controller/Notifications/NotificationController";
import { GetNotificationUseCase } from "../../../useCases/Notifications/GetNotificationusecase";
import { NotificationRepository } from "../../../adapters/repository/Notification/NotificationRepo";
import { SendNotificationUseCase } from "../../../useCases/Notifications/SendNotificationUsecase";
import { FirebaseNotificationService } from "../../Services/FirebaseNotificationService";
import { VendorRepository } from "../../../adapters/repository/Vendor/VendorRepository";
import { PackageRepository } from "../../../adapters/repository/Package/PackageRepository";
import { ReadNotificationusecase } from "../../../useCases/Notifications/ReadNotificationusecase";
import { CompleteTripUseCase } from "../../../useCases/Wallet/completedTripUsecase";
import { MessageRepository } from "../../../adapters/repository/Msg/MessageRepository";
// import { ChatController } from "../../../adapters/controller/chat/ChatController";
// import { GetNotificationUseCase } from "../../../useCases/notifications/GetNotificationusecase";

import { TravelPostRepository } from "../../../adapters/repository/TravelPost/TravelPostRepository";
import { CreateTravelPostUsecase } from "../../../useCases/TravelPost/CreateTravelPostUsecase";
import { ListTravelPostsUsecase } from "../../../useCases/TravelPost/ListTravelPostsUsecase";
import { GetTravelPostUsecase } from "../../../useCases/TravelPost/GetTravelPostUsecase";
import { ToggleSaveTravelPostUsecase } from "../../../useCases/TravelPost/ToggleSaveTravelPostUsecase";
import { ListSavedTravelPostsUsecase } from "../../../useCases/TravelPost/ListSavedTravelPostsUsecase";
import { TravelPostController } from "../../../adapters/controller/TravelPost/TravelPostController";
import { CategoryRepository } from "../../../adapters/repository/Category/CategoryRepository";
import { DestinationRepository } from "../../../adapters/repository/Destination/DestinationRepository";
import { GetAllCategories } from "../../../useCases/Category/getAllCategoryUsecase";
import { GetAllDestinations } from "../../../useCases/destination/getAllDestinationUsecase";
import { GetMessagesUseCase } from "../../../useCases/Msg/getMessageUsecase";
import { MarkMessagesSeenUseCase } from "../../../useCases/Chat/MarkMessageusecase";
import { EmailService } from "../../Services/EmailService";



// Setup Repos and Services
const userRepository = new UserRepository();
const authRepository = new AuthRepository()
const vendorRepo = new VendorRepository()
const otpService = new OtpService();
const hashPassword = new HashPassword();
const jwtService = new JwtService
const bookingRepo = new BookingRepository()
const stripeService = new StripeService();
const reviewRepo = new ReviewRepository()
const paymentRepo = new PaymentRepository(stripeService)
const subscriptionRepo = new SubscriptionPlanRepository()
const walletRepo = new WalletRepository()
const notificationRepo = new NotificationRepository()
const packageRepo = new PackageRepository()
const notificationservice = new FirebaseNotificationService(notificationRepo, userRepository, vendorRepo,)
const emailService = new EmailService();
const chatRepo = new ChatRepository()
const msgRepo = new MessageRepository()
const travelPostRepo = new TravelPostRepository()
const travelPostCategoryRepo = new CategoryRepository()
const travelPostDestinationRepo = new DestinationRepository()

const subscriptionbookingRepo = new SubscriptionBookingRepository()
// ...

// Use Cases
const registerUsecase = new RegisterUserUseCase(userRepository, otpService);
const googleSignupUseCase = new GoogleSignupUseCase(authRepository, userRepository);
const verifyOtpUsecase = new VerifyOtpUseCase(otpService, hashPassword, userRepository);
const loginUserUseCase = new UserLoginUseCase(userRepository, hashPassword, jwtService);
const resetPasswordUseCase = new ResetPasswordUseCase(userRepository, hashPassword);
const userprofile = new UserProfileUsecase(userRepository);
const resendotpusecase = new ResendOtpUsecase(otpService);
const edituserProfile = new EditUserProfile()
const createbookingusecase = new CreateBookingUseCase(bookingRepo, walletRepo, packageRepo, notificationservice, emailService) // Inject EmailService
const createpaymentusecase = new CreatePaymentUsecase(paymentRepo)
const userbookings = new GetUserBookingUsecase(bookingRepo)
const vendorsidebookings = new GetVendorSideBookingUsecase(bookingRepo)
const bookingdateusecase = new BookingDateUsecase(bookingRepo)
const createReviewusecase = new CreateReviewUseCase(reviewRepo, packageRepo, notificationservice)
const getReviewsUsecase = new GetReviewUsecase(reviewRepo)
const changepasswordusecase = new ChangePasswordUseCase(userRepository)
const verifypaymentusecase = new VerifyPaymentUseCase(
  stripeService,
  subscriptionRepo,
  subscriptionbookingRepo
);
const cancelbookingusecase = new cancelBookingUsecase(bookingRepo, walletRepo, packageRepo, notificationservice)
const createwalletusecase = new CreateUserWalletUsecase(walletRepo)
const getUserWalletusecase = new GetUserWalletUsecase(walletRepo)
const forgotPassUsecase = new ForgotPassUsecase(userRepository)
const notificationUsecase = new SendNotificationUseCase(notificationservice)
const sendchatusecase = new InitiateChatUsecase(chatRepo, bookingRepo)
const getchatusecase = new GetChatsOfUserUsecase(chatRepo)
const getmessagesusecase = new GetMessagesUseCase(msgRepo)
const markmessagesseenusecase = new MarkMessagesSeenUseCase(msgRepo, chatRepo)
const transferamountusecase = new TransferAmountUseCase(walletRepo)
const completedbookings = new GetCompletedBookingsForTransfer(bookingRepo)
const getNotificationusecase = new GetNotificationUseCase(notificationservice)
const reshedulebookingusecase = new BookingRescheduleUseCase(bookingRepo, packageRepo, notificationservice)
const walletpaymentusecase = new WalletPaymentUseCase(walletRepo)
const readnotificationusecase = new ReadNotificationusecase(notificationRepo)
const completedTripusecase = new CompleteTripUseCase(walletRepo, bookingRepo, packageRepo)
const getAllBookingsUseCase = new GetAllBookingsUsecase(bookingRepo)
// const walletpaymentusecase=new walletpaymentusecase()
const createTravelPostUsecase = new CreateTravelPostUsecase(travelPostRepo)
const listTravelPostsUsecase = new ListTravelPostsUsecase(travelPostRepo, userRepository)
const getTravelPostUsecase = new GetTravelPostUsecase(travelPostRepo, userRepository)
const toggleSaveTravelPostUsecase = new ToggleSaveTravelPostUsecase(userRepository, travelPostRepo)
const listSavedTravelPostsUsecase = new ListSavedTravelPostsUsecase(userRepository, travelPostRepo)
const travelPostCategoriesUsecase = new GetAllCategories(travelPostCategoryRepo)
const travelPostDestinationsUsecase = new GetAllDestinations(travelPostDestinationRepo)

// Controllers
export const userRegisterController = new UserRegisterController(registerUsecase, verifyOtpUsecase, resendotpusecase, jwtService);
export const userLoginController = new UserLoginController(
  loginUserUseCase,
  jwtService,
  otpService,
  resetPasswordUseCase,
  forgotPassUsecase,
  createwalletusecase
);
export const googleSignupController = new GoogleSignupController(
  googleSignupUseCase,
  jwtService,
  createwalletusecase
);
export const userprofileController = new UserProfileController(userprofile, edituserProfile, changepasswordusecase);
export const bookingcontroller = new BookingController(createbookingusecase, userbookings, vendorsidebookings, bookingdateusecase, cancelbookingusecase, reshedulebookingusecase, getAllBookingsUseCase)
export const paymentcontroller = new PaymentController(createpaymentusecase)
export const reviewcontroller = new ReviewController(createReviewusecase, getReviewsUsecase)
export const subscriptionpaymentcontroller = new SubscriptionPaymentController(verifypaymentusecase)
export const walletcontroller = new WalletController(createwalletusecase, getUserWalletusecase, transferamountusecase, completedbookings, walletpaymentusecase, completedTripusecase)
export const notificationcontroller = new NotificationController(notificationUsecase, getNotificationusecase, readnotificationusecase)
export const chatcontroller = new ChatController(sendchatusecase, getchatusecase, getmessagesusecase, markmessagesseenusecase)
export const travelPostController = new TravelPostController(
  createTravelPostUsecase,
  listTravelPostsUsecase,
  getTravelPostUsecase,
  toggleSaveTravelPostUsecase,
  listSavedTravelPostsUsecase,
  travelPostCategoriesUsecase,
  travelPostDestinationsUsecase
)
