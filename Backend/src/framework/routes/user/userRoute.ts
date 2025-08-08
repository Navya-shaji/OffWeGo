import { Request, Response, Router } from "express";
import {
  userRegisterController,
  userLoginController,
  googleSignupController,
  userprofileController,
  getpackageByDestinationController,
  bookingcontroller,
} from "../../Di/user/userInjections";
import { JwtSevice } from "../../services/jwtService";
import { destinationController } from "../../Di/admin/adminInjection";
const TokenService = new JwtSevice();

export class UserRoute {
  public userRouter: Router;

  constructor() {
    this.userRouter = Router();
    this.setRoutes();
  }

  private setRoutes(): void {
    this.userRouter.post("/signup", (req: Request, res: Response) => {
      userRegisterController.registerUser(req,res)
    });

    this.userRouter.post("/verify-otp", (req: Request, res: Response) => {
      userRegisterController.verifyOtp(req, res);
    });
    this.userRouter.post("/login", (req: Request, res: Response) => {
      userLoginController.loginUser(req, res);
    });
    this.userRouter.post("/google-signup", (req: Request, res: Response) => {
      googleSignupController.googleSignin(req, res);
    });
    this.userRouter.post("/verify-reset-otp", (req:Request, res:Response) =>
      userLoginController.verifyResetOtp(req, res)
    );
    this.userRouter.post("/forgot-password", (req: Request, res: Response) =>
      userLoginController.forgotPassword(req, res)
    );
    this.userRouter.post("/reset-password", (req: Request, res: Response) =>
      userLoginController.resetPassword(req, res)
    );
    this.userRouter.get("/destinations",(req:Request,res:Response)=>{
      destinationController.getAllDestination(req,res)
    })
    this.userRouter.get("/profile",(req:Request,res:Response)=>{
      userprofileController.GetProfile(req,res)
    })
    this.userRouter.get("/destination/:id",(req:Request,res:Response)=>{
      destinationController.getSingleDestinationController(req,res)
    })
    this.userRouter.post("/resend-otp",(req:Request,res:Response)=>{
      userRegisterController.resendOtp(req,res)
    })
    this.userRouter.get("/destination/:id",(req:Request,res:Response)=>{
      getpackageByDestinationController.getPackages(req,res)
    })
    this.userRouter.patch("/profile/:id",(req:Request,res:Response)=>{
      userprofileController.editProfileHandler(req,res)
    })
    this.userRouter.post("/bookings/:packageId",(req:Request,res:Response)=>{
      bookingcontroller.createBooking(req,res)
    })
  }
}
