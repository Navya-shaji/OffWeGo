import { Request, Response, Router } from "express";
import {
  userRegisterController,
  verifyOtpController,
  userLoginController,
  googleSignupController,
  forgotpassController,
  verifyingOtpController,
  resetPasswordController,
  getDestinationController,
  userprofileController,
  getSingledestinationController,
  resendOtpController,
  getpackageByDestinationController,
  getusereditProfile,
} from "../../Di/user/userInjections";
import { JwtSevice } from "../../services/jwtService";
const TokenService = new JwtSevice();

export class UserRoute {
  public userRouter: Router;

  constructor() {
    this.userRouter = Router();
    this.setRoutes();
  }

  private setRoutes(): void {
    this.userRouter.post("/signup", (req: Request, res: Response) => {
      userRegisterController.registerUser(req, res);
    });

    this.userRouter.post("/verify-otp", (req: Request, res: Response) => {
      verifyOtpController.verifyOtp(req, res);
    });
    this.userRouter.post("/login", (req: Request, res: Response) => {
      userLoginController.loginUser(req, res);
    });
    this.userRouter.post("/google-signup", (req: Request, res: Response) => {
      googleSignupController.googleSignin(req, res);
    });
    this.userRouter.post("/verify-reset-otp", (req:Request, res:Response) =>
      verifyingOtpController.verifyResetOtp(req, res)
    );
    this.userRouter.post("/forgot-password", (req: Request, res: Response) =>
      forgotpassController.forgotPassword(req, res)
    );
    this.userRouter.post("/reset-password", (req: Request, res: Response) =>
      resetPasswordController.resetPassword(req, res)
    );
    this.userRouter.get("/destinations",(req:Request,res:Response)=>{
      getDestinationController.getAllDestination(req,res)
    })
    this.userRouter.get("/profile",(req:Request,res:Response)=>{
      userprofileController.GetProfile(req,res)
    })
    this.userRouter.get("/destination/:id",(req:Request,res:Response)=>{
      getSingledestinationController.getSingleDestinationController(req,res)
    })
    this.userRouter.post("/resend-otp",(req:Request,res:Response)=>{
      resendOtpController.resendOtp(req,res)
    })
    this.userRouter.get("/destination/:id",(req:Request,res:Response)=>{
      getpackageByDestinationController.getPackages(req,res)
    })
    this.userRouter.patch("/profile/:id",(req:Request,res:Response)=>{
      getusereditProfile.editProfileHandler(req,res)
    })
  }
}
