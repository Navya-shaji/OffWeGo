import { Router, Request, Response } from "express";
import {
  vendorsignupcontroller,
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
  }
}
