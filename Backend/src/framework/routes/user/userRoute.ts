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
  chatcontroller,
  notificationcontroller,
  travelPostController,
} from "../../Di/User/userInjections";
import { JwtService } from "../../Services/jwtService";
import { destinationController } from "../../Di/Admin/adminInjection";
import { UserRoutes, UserRouteConstants } from "../Constants/UserRouteConstants";
import { CommonRoutes } from "../Constants/commonRoutes";
import { verifyTokenAndCheckBlackList } from "../../../adapters/flowControl/TokenValidationControl";
import { checkRoleBasedcontrol } from "../../../adapters/flowControl/RoleBasedControl";
import { refreshTokenController } from "../../Di/RefreshToken/refreshtokenInjection";
import {
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

    this.userRouter.get(
      UserRoutes.SEARCH_PACKAGES,
      (req: Request, res: Response) => {
        packagecontroller.searchPackage(req, res);
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
      verifyTokenAndCheckBlackList(TokenService),
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
    this.userRouter.put(
      UserRoutes.PASSWORD,
      verifyTokenAndCheckBlackList(TokenService),
      (req: Request, res: Response) => {
        userprofileController.changePasswordHandler(req, res);
      }
    );
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
    this.userRouter.patch(
      UserRoutes.BOOKING_RESHEDULE,
      (req: Request, res: Response) => {
        bookingcontroller.rescheduleBooking(req, res);
      }
    );
    this.userRouter.post(
      UserRoutes.NOTIFY,
      verifyTokenAndCheckBlackList(TokenService),
      (req: Request, res: Response) => {
        notificationcontroller.getNotifications(req, res);
      }
    );
    this.userRouter.patch(
      UserRoutes.READ_NOTIFICATION,
      verifyTokenAndCheckBlackList(TokenService),
      (req: Request, res: Response) => {
        notificationcontroller.readNotifications(req, res);
      }
    );
    this.userRouter.post(
      UserRoutes.WALLET_BOOKING,
      (req: Request, res: Response) => {
        bookingcontroller.createBookingWithWallet(req, res);
      }
    );
    this.userRouter.post(
      UserRoutes.WALLET_PAYMENT,
      (req: Request, res: Response) => {
        walletcontroller.walletPayment(req, res);
      }
    );

    this.userRouter.get(UserRoutes.TRAVEL_POSTS, (req: Request, res: Response) => {
      travelPostController.listTravelPosts(req, res);
    });
    this.userRouter.get(
      UserRoutes.TRAVEL_POSTS_MY,
      verifyTokenAndCheckBlackList(TokenService),
      checkRoleBasedcontrol(["user"]),
      (req: Request, res: Response) => {
        travelPostController.listMyTravelPosts(req, res);
      }
    );
    this.userRouter.get(
      UserRoutes.TRAVEL_POST_CATEGORIES,
      (req: Request, res: Response) => {
        travelPostController.listTravelPostFilters(req, res);
      }
    );
    this.userRouter.post(
      UserRoutes.TRAVEL_POSTS,
      verifyTokenAndCheckBlackList(TokenService),
      checkRoleBasedcontrol(["user"]),
      (req: Request, res: Response) => {
        travelPostController.createTravelPost(req, res);
      }
    );

    this.userRouter.get(
      UserRouteConstants.TRAVEL_POST_BY_SLUG,
      (req: Request, res: Response) => {
        travelPostController.getTravelPostBySlug(req, res);
      }
    );

    this.userRouter.post(
      UserRouteConstants.TRAVEL_POST_TOGGLE_SAVE,
      verifyTokenAndCheckBlackList(TokenService),
      checkRoleBasedcontrol(["user"]),
      (req: Request, res: Response) => {
        travelPostController.toggleSaveTravelPost(req, res);
      }
    );

    this.userRouter.get(
      UserRouteConstants.TRAVEL_POST_SAVED,
      verifyTokenAndCheckBlackList(TokenService),
      checkRoleBasedcontrol(["user"]),
      (req: Request, res: Response) => {
        travelPostController.listSavedTravelPosts(req, res);
      }
    );
    this.userRouter.post(CommonRoutes.CHAT, (req: Request, res: Response) => {
      chatcontroller.findOrCreateChat(req, res);
    });

    this.userRouter.get(
      CommonRoutes.GET_MESSAGES,
      (req: Request, res: Response) => {
        chatcontroller.getMessages(req, res);
      }
    );
    this.userRouter.get(
      CommonRoutes.GET_CHATS,
      (req: Request, res: Response) => {
        chatcontroller.getChats(req, res);
      }
    );
    this.userRouter.post(
      CommonRoutes.MSG_SEEN,
      (req: Request, res: Response) => {
        chatcontroller.markMessagesSeen(req, res);
      }
    );
  }
}
