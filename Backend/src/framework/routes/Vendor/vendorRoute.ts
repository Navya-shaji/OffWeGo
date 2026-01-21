import { Router, Request, Response } from "express";
import {
  activitycontroller,
  flightcontroller,
  hotelcontroller,
  packagecontroller,
  subscriptionBookingController,
  vendorloginController,
  vendorProfilecontroller,
  vendorsignupcontroller,
  vendorstatusCheckController,
  vendorAuthStatusController,
  vendorVerifyOtpController,
} from "../../Di/Vendor/VendorInjections";
import { destinationController } from "../../Di/Admin/adminInjection";
import { VendorRoutes } from "../Constants/VendorRouteConstants";
import { verifyTokenAndCheckBlackList } from "../../../adapters/flowControl/TokenValidationControl";
import { JwtService } from "../../Services/jwtService";
import { checkRoleBasedcontrol } from "../../../adapters/flowControl/RoleBasedControl";
import { CommonRoutes } from "../Constants/commonRoutes";
import { refreshTokenController } from "../../Di/RefreshToken/refreshtokenInjection";
import {
  bookingcontroller,
  notificationcontroller,
  subscriptionpaymentcontroller,
  walletcontroller,
} from "../../Di/User/userInjections";
import { chatcontroller } from "../../Di/Chat/ChatInjection";
import { Role } from "../../../domain/constants/Roles";

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
      VendorRoutes.AUTH_STATUS,
      checkRoleBasedcontrol([Role.VENDOR]),
      (req: Request, res: Response) =>
        vendorAuthStatusController.getAuthVendorStatus(req, res)
    );

    this.vendorRouter.get(
      VendorRoutes.PROFILE,
      checkRoleBasedcontrol([Role.VENDOR]),
      (req: Request, res: Response) =>
        vendorProfilecontroller.GetProfile(req, res)
    );

    this.vendorRouter.put(
      VendorRoutes.EDIT_PROFILE,
      checkRoleBasedcontrol([Role.VENDOR]),
      (req: Request, res: Response) =>
        vendorProfilecontroller.EditProfile(req, res)
    );

    this.vendorRouter.post(
      VendorRoutes.ALL_PACKAGES,
      checkRoleBasedcontrol([Role.VENDOR]),
      (req: Request, res: Response) => packagecontroller.getAllPackage(req, res)
    );

    this.vendorRouter.post(
      VendorRoutes.ADD_PACKAGE,
      checkRoleBasedcontrol([Role.VENDOR]),
      (req: Request, res: Response) => packagecontroller.addPackage(req, res)
    );

    this.vendorRouter.put(
      VendorRoutes.EDIT_PACKAGE,
      checkRoleBasedcontrol([Role.VENDOR]),
      (req: Request, res: Response) => packagecontroller.EditPackage(req, res)
    );

    this.vendorRouter.delete(
      VendorRoutes.DELET_PACKAGE,
      checkRoleBasedcontrol([Role.VENDOR]),
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
      checkRoleBasedcontrol([Role.VENDOR]),
      (req: Request, res: Response) =>
        destinationController.addDestination(req, res)
    );

    this.vendorRouter.get(
      VendorRoutes.GET_DESTINATIONS,
      checkRoleBasedcontrol([Role.VENDOR, Role.ADMIN]),
      (req: Request, res: Response) =>
        destinationController.getAllDestination(req, res)
    );

    this.vendorRouter.delete(
      VendorRoutes.DELETE_DESTINATION,
      checkRoleBasedcontrol([Role.VENDOR, Role.ADMIN]),
      (req: Request, res: Response) =>
        destinationController.deleteDestinationController(req, res)
    );

    this.vendorRouter.post(
      VendorRoutes.CREATE_HOTEL,
      checkRoleBasedcontrol([Role.VENDOR]),
      (req: Request, res: Response) => hotelcontroller.createHotels(req, res)
    );
    this.vendorRouter.get(
      VendorRoutes.HOTELS,
      checkRoleBasedcontrol([Role.VENDOR, Role.USER]),
      (req: Request, res: Response) => hotelcontroller.getHotels(req, res)
    );
    this.vendorRouter.put(
      VendorRoutes.EDIT_HOTEL,
      checkRoleBasedcontrol([Role.VENDOR]),
      (req: Request, res: Response) => hotelcontroller.editHotel(req, res)
    );

    this.vendorRouter.delete(
      VendorRoutes.DELETE_HOTEL,
      checkRoleBasedcontrol([Role.VENDOR]),
      (req: Request, res: Response) => hotelcontroller.deleteHotel(req, res)
    );

    this.vendorRouter.post(
      VendorRoutes.CREATE_ACTIVITY,
      checkRoleBasedcontrol([Role.VENDOR]),
      (req: Request, res: Response) =>
        activitycontroller.createActivities(req, res)
    );

    this.vendorRouter.put(
      VendorRoutes.EDIT_ACTIVITY,
      checkRoleBasedcontrol([Role.VENDOR]),
      (req: Request, res: Response) =>
        activitycontroller.editActivities(req, res)
    );

    this.vendorRouter.delete(
      VendorRoutes.DELETE_ACTIVITY,
      checkRoleBasedcontrol([Role.VENDOR]),
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
      checkRoleBasedcontrol([Role.VENDOR, Role.USER]),
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
      (req: Request, res: Response) =>
        bookingcontroller.getVendorsideBookings(req, res)
    );
    this.vendorRouter.get(
      VendorRoutes.BOOKING_DATES,
      (req: Request, res: Response) => bookingcontroller.bookingDates(req, res)
    );
    this.vendorRouter.post(
      VendorRoutes.SUBSCRIPTION_BOOKING,
      (req: Request, res: Response) =>
        subscriptionBookingController.createSubscriptionBooking(req, res)
    );
    this.vendorRouter.get(
      VendorRoutes.GET_VENDOR_SUBSCRIPTION,
      verifyTokenAndCheckBlackList(TokenService),
      checkRoleBasedcontrol([Role.VENDOR]),
      (req: Request, res: Response) =>
        subscriptionBookingController.getVendorSubscription(req, res)
    );

    this.vendorRouter.get(
      "/subscription/history",
      verifyTokenAndCheckBlackList(TokenService),
      checkRoleBasedcontrol([Role.VENDOR]),
      (req: Request, res: Response) =>
        subscriptionBookingController.getVendorSubscriptionHistory(req, res)
    );

    this.vendorRouter.delete(
      "/subscription/:bookingId/cancel",
      verifyTokenAndCheckBlackList(TokenService),
      checkRoleBasedcontrol([Role.VENDOR]),
      (req: Request, res: Response) =>
        subscriptionBookingController.cancelSubscription(req, res)
    );

    this.vendorRouter.post(
      "/subscription/:bookingId/retry",
      verifyTokenAndCheckBlackList(TokenService),
      checkRoleBasedcontrol([Role.VENDOR]),
      (req: Request, res: Response) =>
        subscriptionBookingController.retryPayment(req, res)
    );
    this.vendorRouter.post(
      VendorRoutes.VERIFY_PAYMENT,
      (req: Request, res: Response) =>
        subscriptionpaymentcontroller.verifyPayment(req, res)
    );


    this.vendorRouter.post("/chat/send", (req: Request, res: Response) => {
      chatcontroller.findOrCreateChat(req, res);
    });
    this.vendorRouter.get("/chat/messages/:chatId", (req: Request, res: Response) => {
      chatcontroller.getMessages(req, res);
    });
    this.vendorRouter.get("/chat/:vendorId", (req: Request, res: Response) => {

      req.query.userType = 'vendor';
      chatcontroller.getChats(req, res);
    });
    this.vendorRouter.post("/chat/messages/mark-seen", (req: Request, res: Response) => {
      chatcontroller.markMessagesSeen(req, res);
    });
    this.vendorRouter.post(
      VendorRoutes.VENDOR_WALLET,
      (req: Request, res: Response) => {
        walletcontroller.createWallet(req, res)
      }
    )
    this.vendorRouter.get(
      VendorRoutes.GET_VENDOR_WALLET,
      checkRoleBasedcontrol([Role.VENDOR, Role.ADMIN]),
      (req: Request, res: Response) => {
        walletcontroller.GetWallet(req, res)
      }
    )


    this.vendorRouter.post(
      "/notification/notify",
      checkRoleBasedcontrol([Role.VENDOR]),
      (req: Request, res: Response) => {
        notificationcontroller.getNotifications(req, res);
      }
    );
    this.vendorRouter.patch(
      "/notification/read/:id",
      checkRoleBasedcontrol([Role.VENDOR]),
      (req: Request, res: Response) => {
        notificationcontroller.readNotifications(req, res);
      }
    );

  }
}
