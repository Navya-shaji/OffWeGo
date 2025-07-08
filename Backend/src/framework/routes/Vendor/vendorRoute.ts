import { Router, Request, Response } from "express";
import {
  vendorloginController,
  vendorsignupcontroller,
  vendorstatusCheckController,
  vendorVerifyOtpController,
} from "../../Di/Vendor/VendorInjections";

export class VendorRoute {
  public vendorRouter: Router;

  constructor() {
    this.vendorRouter = Router();
    this.setRoutes();
  }

  private setRoutes(): void {
    this.vendorRouter.post("/signup", (req: Request, res: Response) => {
      vendorsignupcontroller.VendorSignup(req, res);
    });

    this.vendorRouter.post("/verify-otp", (req, res) =>
      vendorVerifyOtpController.verifyOtp(req, res)
    );
    this.vendorRouter.get("/status",(req:Request,res:Response)=>{
      vendorstatusCheckController.checkStatus(req,res)
    })
    this.vendorRouter.post("/login",(req:Request,res:Response)=>{
      vendorloginController.login(req,res)
    })
  }
}
