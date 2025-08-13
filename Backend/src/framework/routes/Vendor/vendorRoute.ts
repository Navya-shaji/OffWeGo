import { Router, Request, Response } from "express";
import {
  activitycontroller,
  hotelcontroller,
  packagecontroller,
  packagewisegroupcontroller,
  vendorloginController,
  vendorProfilecontroller,
  vendorsignupcontroller,
  vendorstatusCheckController,
  vendorVerifyOtpController,
} from "../../Di/Vendor/VendorInjections";
import { destinationController } from "../../Di/admin/adminInjection";
import { VendorRoutes } from "../Constants/VendorRouteConstants";
 

export class VendorRoute {
  public vendorRouter: Router;

  constructor() {
    this.vendorRouter = Router();
    this.setRoutes();
  }

  private setRoutes(): void {
    this.vendorRouter.post(VendorRoutes.SIGNUP, (req: Request, res: Response) => {
      vendorsignupcontroller.VendorSignup(req, res);
    });

    this.vendorRouter.post(VendorRoutes.VERIFY_OTP, (req, res) =>
      vendorVerifyOtpController.verifyOtp(req, res)
    );
    this.vendorRouter.get(VendorRoutes.CHECK_STATUS,(req:Request,res:Response)=>{
      vendorstatusCheckController.checkStatus(req,res)
    })
    this.vendorRouter.post(VendorRoutes.LOGIN,(req:Request,res:Response)=>{
      vendorloginController.login(req,res)
    })
    this.vendorRouter.get(VendorRoutes.PROFILE,(req:Request,res:Response)=>{
      vendorProfilecontroller.GetProfile(req,res)
    })
    this.vendorRouter.get(VendorRoutes.DESTINATIONS,(req:Request,res:Response)=>{
      destinationController.getAllDestination(req,res)
    })
    this.vendorRouter.post(VendorRoutes.ADD_PACKAGE,(req:Request,res:Response)=>{
      packagecontroller.addPackage(req,res)
    })
    this.vendorRouter.get(VendorRoutes.ALL_PACKAGES,(req:Request,res:Response)=>{
      packagecontroller.getAllPackage(req,res)
    })
    this.vendorRouter.put(VendorRoutes.EDIT_PACKAGE,(req:Request,res:Response)=>{
      packagecontroller.EditPackage(req,res)
    })
    this.vendorRouter.delete(VendorRoutes.DELET_PACKAGE,(req:Request,res:Response)=>{
      packagecontroller.deletePackage(req,res)
    })
    this.vendorRouter.put(VendorRoutes.EDIT_PROFILE,(req:Request,res:Response)=>{
      vendorProfilecontroller.EditProfile(req,res)
    })
    this.vendorRouter.post(VendorRoutes.PACKAGE_WISE_GROUPING,(req:Request,res:Response)=>{
      packagewisegroupcontroller.CreatePackageWiseGrouping(req,res)
    })
    this.vendorRouter.get(VendorRoutes.PACKAGE_WISE_GROUPS,(req:Request,res:Response)=>{
      packagewisegroupcontroller.GetPackageWiseGroups(req,res)
    })
    this.vendorRouter.post(VendorRoutes.CREATE_HOTEL,(req:Request,res:Response)=>{
      hotelcontroller.createHotels(req,res)
    })
    this.vendorRouter.get(VendorRoutes.HOTELS,(req:Request,res:Response)=>{
     hotelcontroller.getHotels(req,res)
   })
    this.vendorRouter.post(VendorRoutes.CREATE_ACTIVITY,(req:Request,res:Response)=>{
      activitycontroller.createActivities(req,res)
    })
       this.vendorRouter.get(VendorRoutes.ACTIVITIES,(req:Request,res:Response)=>{
      activitycontroller.getAllActivities(req,res)
    })
    this.vendorRouter.put(VendorRoutes.EDIT_ACTIVITY,(req:Request,res:Response)=>{
      activitycontroller.editActivities(req,res)
    })
  } 
}
