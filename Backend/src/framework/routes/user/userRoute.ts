import { Request, Response, Router } from "express";
import {
  userRegisterController,
  userLoginController,
  googleSignupController,
  userprofileController,
  bookingcontroller,
} from "../../Di/User/UserInjections";
import { JwtService } from "../../Services/jwtService";
import { destinationController } from "../../Di/Admin/AdminInjection";
import { UserRoutes } from "../Constants/UserRouteConstants";
import { verifyTokenAndCheckBlackList } from "../../../adapters/flowControl/TokenValidationControl";
import { checkRoleBasedcontrol } from "../../../adapters/flowControl/RoleBasedControl";
import { CommonRoutes } from "../Constants/commonRoutes";
import { refreshTokenController } from "../../Di/RefreshToken/RefreshtokenInjection";
import { packagecontroller } from "../../Di/Vendor/VendorInjections";
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
        packagecontroller.getPackagesForUser(req,res)
      }
    );
    this.userRouter.patch(
      UserRoutes.EDIT_PROFILE,
      (req: Request, res: Response) => {
        userprofileController.editProfileHandler(req, res);
      }
    );
    this.userRouter.post(
      UserRoutes.CREATE_BOOKING,
      verifyTokenAndCheckBlackList(TokenService),
      checkRoleBasedcontrol(["user"]),
      (req: Request, res: Response) => {
        bookingcontroller.createBooking(req, res);
      }
    );
  }
}
