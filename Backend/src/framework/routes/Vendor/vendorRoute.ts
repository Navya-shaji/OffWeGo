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
import { destinationController } from "../../Di/Admin/AdminInjection";
import { VendorRoutes } from "../Constants/VendorRouteConstants";
import { verifyTokenAndCheckBlackList } from "../../../adapters/flowControl/TokenValidationControl";
import { JwtService } from "../../Services/jwtService";
import { checkRoleBasedcontrol } from "../../../adapters/flowControl/RoleBasedControl";
import { CommonRoutes } from "../Constants/commonRoutes";
import { refreshTokenController } from "../../Di/RefreshToken/RefreshtokenInjection";

const TokenService = new JwtService();

export class VendorRoute {
  public vendorRouter: Router;

  constructor() {
    this.vendorRouter = Router();
    this.setRoutes();
  }

  private setRoutes(): void {
    console.log("routes initialized");

    // Public routes
    this.vendorRouter.post(VendorRoutes.SIGNUP, (req: Request, res: Response) =>
      vendorsignupcontroller.VendorSignup(req, res)
    );

    this.vendorRouter.post(VendorRoutes.VERIFY_OTP, (req, res) =>
      vendorVerifyOtpController.verifyOtp(req, res)
    );

    this.vendorRouter.get(
      VendorRoutes.CHECK_STATUS,
      (req: Request, res: Response) =>
        vendorstatusCheckController.checkStatus(req, res)
    );

    this.vendorRouter.post(VendorRoutes.LOGIN, (req: Request, res: Response) =>
      vendorloginController.login(req, res)
    );

    this.vendorRouter.post(
      CommonRoutes.REFRESH_TOKEN,
      (req: Request, res: Response) => refreshTokenController.handle(req, res)
    );

    // Apply authentication middleware for all routes below
    this.vendorRouter.use(verifyTokenAndCheckBlackList(TokenService));

    // Profile routes (protected)
    this.vendorRouter.get(
      VendorRoutes.PROFILE,
      checkRoleBasedcontrol(["vendor"]),
      (req: Request, res: Response) =>
        vendorProfilecontroller.GetProfile(req, res)
    );

    this.vendorRouter.put(
      VendorRoutes.EDIT_PROFILE,
      checkRoleBasedcontrol(["vendor"]),
      (req: Request, res: Response) =>
        vendorProfilecontroller.EditProfile(req, res)
    );

    // Package routes (protected)
    this.vendorRouter.post(
      VendorRoutes.ALL_PACKAGES,
      checkRoleBasedcontrol(["vendor"]),
      (req: Request, res: Response) => packagecontroller.getAllPackage(req, res)
    );

    this.vendorRouter.post(
      VendorRoutes.ADD_PACKAGE,
      checkRoleBasedcontrol(["vendor"]),
      (req: Request, res: Response) => packagecontroller.addPackage(req, res)
    );

    this.vendorRouter.put(
      VendorRoutes.EDIT_PACKAGE,
      checkRoleBasedcontrol(["vendor"]),
      (req: Request, res: Response) => packagecontroller.EditPackage(req, res)
    );

    this.vendorRouter.delete(
      VendorRoutes.DELET_PACKAGE,
      checkRoleBasedcontrol(["vendor"]),
      (req: Request, res: Response) => packagecontroller.deletePackage(req, res)
    );

    this.vendorRouter.get(
      VendorRoutes.SEARCH_PACKAGE,
      checkRoleBasedcontrol(["vendor"]),
      (req: Request, res: Response) => packagecontroller.searchPackage(req, res)
    );

    // Destination routes
    this.vendorRouter.post(
      VendorRoutes.CREATE_DESTINATION,
      checkRoleBasedcontrol(["vendor"]),
      (req: Request, res: Response) =>
        destinationController.addDestination(req, res)
    );

    this.vendorRouter.get(
      VendorRoutes.GET_DESTINATIONS,
      checkRoleBasedcontrol(["vendor", "admin"]),
      (req: Request, res: Response) =>
        destinationController.getAllDestination(req, res)
    );

    this.vendorRouter.delete(
      VendorRoutes.DELETE_DESTINATION,
      checkRoleBasedcontrol(["vendor", "admin"]),
      (req: Request, res: Response) =>
        destinationController.deleteDestinationController(req, res)
    );

    this.vendorRouter.post(
      VendorRoutes.CREATE_HOTEL,
      checkRoleBasedcontrol(["vendor"]),
      (req: Request, res: Response) => hotelcontroller.createHotels(req, res)
    );
    this.vendorRouter.get(
      VendorRoutes.HOTELS,
      checkRoleBasedcontrol(["vendor"]),
      (req: Request, res: Response) => hotelcontroller.getHotels(req, res)
    );
    this.vendorRouter.put(
      VendorRoutes.EDIT_HOTEL,
      checkRoleBasedcontrol(["vendor"]),
      (req: Request, res: Response) => hotelcontroller.editHotel(req, res)
    );

    this.vendorRouter.delete(
      VendorRoutes.DELETE_HOTEL,
      checkRoleBasedcontrol(["vendor"]),
      (req: Request, res: Response) => hotelcontroller.deleteHotel(req, res)
    );

    // Activities routes
    this.vendorRouter.post(
      VendorRoutes.CREATE_ACTIVITY,
      checkRoleBasedcontrol(["vendor"]),
      (req: Request, res: Response) =>
        activitycontroller.createActivities(req, res)
    );

    this.vendorRouter.put(
      VendorRoutes.EDIT_ACTIVITY,
      checkRoleBasedcontrol(["vendor"]),
      (req: Request, res: Response) =>
        activitycontroller.editActivities(req, res)
    );

    this.vendorRouter.delete(
      VendorRoutes.DELETE_ACTIVITY,
      checkRoleBasedcontrol(["vendor"]),
      (req: Request, res: Response) =>
        activitycontroller.deleteActivity(req, res)
    );
    this.vendorRouter.get(
      VendorRoutes.ACTIVITIES,
      (req:Request,res:Response)=>
        activitycontroller.getAllActivities(req,res)
    )
    // Package-wise group routes
    this.vendorRouter.get(
      VendorRoutes.PACKAGE_WISE_GROUPS,
      checkRoleBasedcontrol(["vendor"]),
      (req: Request, res: Response) =>
        packagewisegroupcontroller.GetPackageWiseGroups(req, res)
    );

    this.vendorRouter.post(
      VendorRoutes.PACKAGE_WISE_GROUPING,
      checkRoleBasedcontrol(["vendor"]),
      (req: Request, res: Response) =>
        packagewisegroupcontroller.CreatePackageWiseGrouping(req, res)
    );
  }
}
