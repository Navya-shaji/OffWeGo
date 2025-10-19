import { Router, Request, Response } from "express";
import {
  activitycontroller,
  flightcontroller,
  hotelcontroller,
  packagecontroller,
  vendorloginController,
  vendorProfilecontroller,
  vendorsignupcontroller,
  vendorstatusCheckController,
  vendorVerifyOtpController,
} from "../../Di/Vendor/VendorInjections";
import { destinationController } from "../../Di/Admin/adminInjection";
import { VendorRoutes } from "../Constants/VendorRouteConstants";
import { verifyTokenAndCheckBlackList } from "../../../adapters/flowControl/TokenValidationControl";
import { JwtService } from "../../Services/jwtService";
import { checkRoleBasedcontrol } from "../../../adapters/flowControl/RoleBasedControl";
import { CommonRoutes } from "../Constants/commonRoutes";
import { refreshTokenController } from "../../Di/RefreshToken/refreshtokenInjection";
import { bookingcontroller } from "../../Di/User/userInjections";

const TokenService = new JwtService();

export class VendorRoute {
  public vendorRouter: Router;

  constructor() {
    this.vendorRouter = Router();
    this.setRoutes();
  }

  private setRoutes(): void {
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

    this.vendorRouter.use(verifyTokenAndCheckBlackList(TokenService));

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

      (req: Request, res: Response) => packagecontroller.searchPackage(req, res)
    );

    this.vendorRouter.get(
      VendorRoutes.SEARCH_HOTEL,
      (req: Request, res: Response) => {
        hotelcontroller.SearchHotel(req, res);
      }
    );
    this.vendorRouter.get(
      VendorRoutes.SEARCH_ACTIVITY,
      (req: Request, res: Response) => {
        activitycontroller.SearchActivity(req, res);
      }
    );
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
      (req: Request, res: Response) =>
        activitycontroller.getAllActivities(req, res)
    );
    this.vendorRouter.post(
      VendorRoutes.CREATE_FLIGHT,
      (req: Request, res: Response) =>
        flightcontroller.addFlightDetails(req, res)
    );
    this.vendorRouter.get(
      VendorRoutes.ALL_FLIGHTS,
      (req: Request, res: Response) => flightcontroller.getAllFlight(req, res)
    );
    this.vendorRouter.put(
      VendorRoutes.EDIT_FLIGHT,
      (req: Request, res: Response) => flightcontroller.EditFlight(req, res)
    );
    this.vendorRouter.delete(
      VendorRoutes.DELETE_FLIGHT,
      (req: Request, res: Response) => flightcontroller.DeleteFlight(req, res)
    );
    this.vendorRouter.get(
      VendorRoutes.USER_BOOKINGS,
      (req:Request,res:Response)=>bookingcontroller.getVendorsideBookings(req,res)
    )
  }
}
