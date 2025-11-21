import { Request, Response, Router } from "express";
import {
  userRegisterController,
  userLoginController,
  googleSignupController,
  userprofileController,
  bookingcontroller,
  paymentcontroller,
  reviewcontroller,
  walletcontroller,
  notificationcontroller,
  chatcontroller,
} from "../../Di/User/userInjections";
import { JwtService } from "../../Services/jwtService";
import { destinationController } from "../../Di/Admin/adminInjection";
import { UserRoutes } from "../Constants/UserRouteConstants";
import { verifyTokenAndCheckBlackList } from "../../../adapters/flowControl/TokenValidationControl";
import { checkRoleBasedcontrol } from "../../../adapters/flowControl/RoleBasedControl";
import { CommonRoutes } from "../Constants/commonRoutes";
import { refreshTokenController } from "../../Di/RefreshToken/refreshtokenInjection";
import {
  buddyTravelcontroller,
  packagecontroller,
} from "../../Di/Vendor/VendorInjections";
const TokenService = new JwtService();

export class UserRoute {
  public userRouter: Router;

  constructor() {
    this.userRouter = Router();
    this.setRoutes();
  }

  private setRoutes(): void {
    this.userRouter.post(UserRoutes.SIGNUP, (req: Request, res: Response) => {
      userRegisterController.registerUser(req, res);
    });

    this.userRouter.get(
      UserRoutes.GET_ALL_DESTINATIONS,
      verifyTokenAndCheckBlackList(TokenService),
      (req: Request, res: Response) => {
        destinationController.getAllDestination(req, res);
      }
    );
    this.userRouter.post(
      UserRoutes.VERIFY_OTP,
      (req: Request, res: Response) => {
        userRegisterController.verifyOtp(req, res);
      }
    );
    this.userRouter.post(UserRoutes.LOGIN, (req: Request, res: Response) => {
      userLoginController.loginUser(req, res);
    });
    this.userRouter.post(
      CommonRoutes.REFRESH_TOKEN,
      (req: Request, res: Response) => {
        refreshTokenController.handle(req, res);
      }
    );
    this.userRouter.post(
      UserRoutes.GOOGLE_SIGNUP,
      (req: Request, res: Response) => {
        googleSignupController.googleSignin(req, res);
      }
    );
    this.userRouter.post(
      UserRoutes.VERIFY_REESET_OTP,
      (req: Request, res: Response) =>
        userLoginController.verifyResetOtp(req, res)
    );
    this.userRouter.post(
      UserRoutes.FORGOT_PASSWORD,
      (req: Request, res: Response) =>
        userLoginController.forgotPassword(req, res)
    );
    this.userRouter.post(
      UserRoutes.RESET_PASSWORD,
      (req: Request, res: Response) =>
        userLoginController.resetPassword(req, res)
    );
    this.userRouter.get(
      UserRoutes.PROFILE,
      verifyTokenAndCheckBlackList(TokenService),
      checkRoleBasedcontrol(["user"]),
      (req: Request, res: Response) => {
        userprofileController.GetProfile(req, res);
      }
    );
    this.userRouter.get(
      UserRoutes.GET_SINGLE_DESTINATION,
      (req: Request, res: Response) => {
        destinationController.getSingleDestinationController(req, res);
      }
    );
    this.userRouter.post(
      UserRoutes.RESEND_OTP,
      (req: Request, res: Response) => {
        userRegisterController.resendOtp(req, res);
      }
    );
    this.userRouter.get(
      UserRoutes.GET_ALL_PACKAGES,
      (req: Request, res: Response) => {
        packagecontroller.getPackagesForUser(req, res);
      }
    );
    this.userRouter.patch(
      UserRoutes.EDIT_PROFILE,
      verifyTokenAndCheckBlackList(TokenService),
      (req: Request, res: Response) => {
        userprofileController.editProfileHandler(req, res);
      }
    );
    this.userRouter.post(
      UserRoutes.CREATE_BOOKING,
      (req: Request, res: Response) => {
        bookingcontroller.createBooking(req, res);
      }
    );
    this.userRouter.post(
      UserRoutes.CREATE_PAYMENT,
      (req: Request, res: Response) => {
        paymentcontroller.createPayment(req, res);
      }
    );
    this.userRouter.get(
      UserRoutes.USER_BOOKINGS,
      (req: Request, res: Response) => {
        bookingcontroller.getUserBookings(req, res);
      }
    );
    this.userRouter.post(UserRoutes.REVIEWS, (req: Request, res: Response) => {
      reviewcontroller.createReview(req, res);
    });
    this.userRouter.get(
      UserRoutes.All_REVIEWS,
      (req: Request, res: Response) => {
        reviewcontroller.getReviews(req, res);
      }
    );
    this.userRouter.put(UserRoutes.PASSWORD, (req: Request, res: Response) => {
      userprofileController.changePasswordHandler(req, res);
    });
    this.userRouter.patch(
      UserRoutes.CANCEL_BOOKING,
      (req: Request, res: Response) => {
        bookingcontroller.cancelBooking(req, res);
      }
    );

    this.userRouter.post(
      UserRoutes.USER_WALLET,
      (req: Request, res: Response) => {
        walletcontroller.createWallet(req, res);
      }
    );
    this.userRouter.get(
      UserRoutes.GET_USER_WALLET,
      (req: Request, res: Response) => {
        walletcontroller.GetWallet(req, res);
      }
    );
    this.userRouter.get(
      UserRoutes.BUDDY_PACKAGES,
      (req: Request, res: Response) => {
        buddyTravelcontroller.getAllbuddyPackages(req, res);
      }
    );
    this.userRouter.post(
      UserRoutes.JOIN_TRAVEL,
      (req: Request, res: Response) => {
        buddyTravelcontroller.JoinBuddyTravel(req, res);
      }
    );
    this.userRouter.post(
      UserRoutes.BOOKING_BUDDYTRAVEL,
      (req: Request, res: Response) => {
        buddyTravelcontroller.createBuddyBooking(req, res);
      }
    );
    this.userRouter.post(
      CommonRoutes.NOTIFICATIONS,
      (req: Request, res: Response) => {
        notificationcontroller.sendNotification(req, res);
      }
    );
    this.userRouter.post(
      CommonRoutes.CHAT,
      (req:Request,res:Response)=>{
        chatcontroller.sendChat(req,res)
      }
    )
    this.userRouter.get(
      CommonRoutes.CHATS,
      (req:Request,res:Response)=>{
        chatcontroller.getChat(req,res)
      }
    )
  
  }
}
