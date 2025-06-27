
import { Request, Response, Router } from "express";
import { userRegisterController, verifyOtpController } from "../../Di/user/userInjections";


export class UserRoute {
  public userRouter: Router;

  constructor() {
    this.userRouter = Router();
    this.setRoutes();
  }

  private setRoutes(): void {
    console.log("haii")
    this.userRouter.post("/signup", (req: Request, res: Response) => {
      console.log("helo")
      userRegisterController.registerUser(req, res);
    });

    this.userRouter.post("/verify-otp",(req:Request,res:Response)=>{
      verifyOtpController.verifyOtp(req,res)
    })
  }
}
