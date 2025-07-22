import { Router, Request, Response } from "express";
import {
  createPackageController,
  getallPackageController,
  vendorDestinationController,
  vendorloginController,
  vendorProfilecontroller,
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
    this.vendorRouter.get("/profile",(req:Request,res:Response)=>{
      vendorProfilecontroller.GetProfile(req,res)
    })
    this.vendorRouter.get('/destinations',(req:Request,res:Response)=>{
      vendorDestinationController.getAllDestination(req,res)
    })
    this.vendorRouter.post("/add-Package",(req:Request,res:Response)=>{
      createPackageController.addPackage(req,res)
    })
    this.vendorRouter.get("/packages",(req:Request,res:Response)=>{
      getallPackageController.getAllPackage(req,res)
    })
    
  } 
}
