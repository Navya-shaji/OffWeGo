import { Router, Request, Response } from "express";
import { vendorsignupcontroller } from "../../Di/Vendor/VendorInjections";
import upload from "../../../utilities/multer";

export class VendorRoute {
  public vendorRouter: Router;

  constructor() {
    this.vendorRouter = Router();
    this.setRoutes();
  }

  private setRoutes(): void {
    this.vendorRouter.post(
      "/signup",
      upload.single("document"), // handles multipart/form-data
      (req: Request, res: Response) => {
        vendorsignupcontroller.VendorSignup(req, res);
      }
    );
  }
}
