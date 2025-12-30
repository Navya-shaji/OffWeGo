import { Router } from "express";
import {
  adminController,
  AdminuserController,
  adminVendorController,
  bannerController,
  categoryController,
  destinationController,
  subscriptionController,
  adminTravelPostController,
} from "../../Di/Admin/adminInjection";

import { verifyTokenAndCheckBlackList } from "../../../adapters/flowControl/TokenValidationControl";
import { JwtService } from "../../Services/jwtService";
import { AdminRoutes } from "../Constants/AdminRouteConstants";
import { checkRoleBasedcontrol } from "../../../adapters/flowControl/RoleBasedControl";
import { CommonRoutes } from "../Constants/commonRoutes";
import { refreshTokenController } from "../../Di/RefreshToken/refreshtokenInjection";
import { Role } from "../../../domain/constants/Roles";
import { walletcontroller } from "../../Di/User/userInjections";
import { buddyTravelcontroller } from "../../Di/Vendor/VendorInjections";

const TokenService = new JwtService();

export class AdminRoute {
  public adminRouter: Router;

  constructor() {
    this.adminRouter = Router();
    this.setRoutes();
  }

  private setRoutes(): void {
    // -------------------- AUTH ROUTES --------------------

    this.adminRouter.post(AdminRoutes.LOGIN, (req, res) =>
      adminController.login(req, res)
    );

    this.adminRouter.post(CommonRoutes.REFRESH_TOKEN, (req, res) =>
      refreshTokenController.handle(req, res)
    );

    // -------------------- PUBLIC ROUTES --------------------

    this.adminRouter.get(AdminRoutes.GET_DESTINATIONS, (req, res) =>
      destinationController.getAllDestination(req, res)
    );

    this.adminRouter.get(AdminRoutes.GET_ALL_BANNERS, (req, res) =>
      bannerController.getBanners(req, res)
    );
   

    // -------------------- TOKEN MIDDLEWARE --------------------

    this.adminRouter.use(verifyTokenAndCheckBlackList(TokenService));
    const adminOnly = checkRoleBasedcontrol([Role.ADMIN]);

    // -------------------- ADMIN-VENDOR MANAGEMENT --------------------

    this.adminRouter.get(AdminRoutes.SEARCH_VENDOR, adminOnly, (req, res) =>
      adminVendorController.searchVendor(req, res)
    );

    this.adminRouter.get(
      AdminRoutes.GET_VENDOR_BY_EMAIL,
      adminOnly,
      (req, res) => adminVendorController.getVendorByEmail(req, res)
    );

    this.adminRouter.patch(
      AdminRoutes.ADMIN_VENDOR_APPROVAL,
      adminOnly,
      (req, res) => adminVendorController.updateVendorApprovalStatus(req, res)
    );

    this.adminRouter.get(AdminRoutes.GET_ALL_VENDORS, adminOnly, (req, res) =>
      adminVendorController.getAllVendors(req, res)
    );

    this.adminRouter.get(
      AdminRoutes.GET_VENDOR_BY_STATUS,
      adminOnly,
      (req, res) => adminVendorController.getVendorsByStatus(req, res)
    );

    this.adminRouter.patch(
      AdminRoutes.BLOCK_UNBLOCK_VENDOR,
      adminOnly,
      (req, res) => adminVendorController.blockOrUnblockVendor(req, res)
    );

    // -------------------- ADMIN-USER MANAGEMENT --------------------

    this.adminRouter.get(AdminRoutes.GET_ALL_USERS, adminOnly, (req, res) =>
      AdminuserController.getAllUsers(req, res)
    );

    this.adminRouter.get(AdminRoutes.SEARCH_USER, adminOnly, (req, res) =>
      AdminuserController.searchUser(req, res)
    );

    this.adminRouter.patch(
      AdminRoutes.UPDATE_USER_STATUS,
      adminOnly,
      (req, res) => AdminuserController.updateStatus(req, res)
    );

    // -------------------- TRAVEL STORY MODERATION --------------------

    this.adminRouter.get(
      AdminRoutes.TRAVEL_POSTS_BY_STATUS,
      adminOnly,
      (req, res) => adminTravelPostController.listTravelPostsByStatus(req, res)
    );

    this.adminRouter.patch(
      AdminRoutes.TRAVEL_POST_STATUS_UPDATE,
      adminOnly,
      (req, res) => adminTravelPostController.updateTravelPostStatus(req, res)
    );

    // -------------------- DESTINATION MANAGEMENT --------------------

    this.adminRouter.post(
      AdminRoutes.CREATE_DESTINATION,
      adminOnly,
      (req, res) => destinationController.addDestination(req, res)
    );

    this.adminRouter.put(
      AdminRoutes.EDIT_DESTINATION,
      checkRoleBasedcontrol([Role.ADMIN, Role.VENDOR]),
      (req, res) => destinationController.editDestinationHandler(req, res)
    );

    this.adminRouter.get(
      AdminRoutes.SEARCH_DESTINATION, 
      (req, res) => destinationController.searchDestination(req, res)
    );
     this.adminRouter.post(AdminRoutes.NEARBY_LOCATIONS,(req,res)=>{
           
      destinationController.getNearByDestination(req,res)
    })

    this.adminRouter.delete(
      AdminRoutes.DELETE_DESTINATION,
      checkRoleBasedcontrol([Role.ADMIN, Role.VENDOR]),
      (req, res) => destinationController.deleteDestinationController(req, res)
    );

    // -------------------- CATEGORY MANAGEMENT --------------------

    this.adminRouter.post(AdminRoutes.CREATE_CATEGORY, adminOnly, (req, res) =>
      categoryController.createCategory(req, res)
    );

    this.adminRouter.get(
      AdminRoutes.GET_ALL_CATEGORIES,
      checkRoleBasedcontrol([Role.ADMIN, Role.VENDOR, Role.USER]),
      (req, res) => categoryController.getCategories(req, res)
    );

    this.adminRouter.get(AdminRoutes.SEARCH_CATEGORY, adminOnly, (req, res) =>
      categoryController.SearchCategory(req, res)
    );

    this.adminRouter.put(AdminRoutes.EDIT_CATEGORY, adminOnly, (req, res) =>
      categoryController.EditCategory(req, res)
    );

    this.adminRouter.delete(
      AdminRoutes.DELETE_CATEGORY,
      adminOnly,
      (req, res) => categoryController.DeleteCategory(req, res)
    );

    // -------------------- BANNER MANAGEMENT --------------------

    this.adminRouter.post(AdminRoutes.CREATE_BANNER, adminOnly, (req, res) =>
      bannerController.createBanner(req, res)
    );

    this.adminRouter.put(AdminRoutes.EDIT_BANNER, adminOnly, (req, res) =>
      bannerController.editBanner(req, res)
    );

    this.adminRouter.delete(AdminRoutes.DELETE_BANNER, adminOnly, (req, res) =>
      bannerController.bannerDelete(req, res)
    );

    this.adminRouter.patch(AdminRoutes.BANNER_ACTIONS, adminOnly, (req, res) =>
      bannerController.bannerAction(req, res)
    );

    // -------------------- SUBSCRIPTION MANAGEMENT --------------------

    this.adminRouter.post(
      AdminRoutes.CREATE_SUBSCRIPTION,
      adminOnly,
      (req, res) => subscriptionController.createSubscription(req, res)
    );

    this.adminRouter.get(
      AdminRoutes.GET_ALL_SUBSCRIPTIONS,
      checkRoleBasedcontrol([Role.ADMIN, Role.VENDOR]),
      (req, res) => subscriptionController.getAllSubscriptions(req, res)
    );

    this.adminRouter.put(AdminRoutes.EDIT_SUBSCRIPTION, adminOnly, (req, res) =>
      subscriptionController.updateSubscription(req, res)
    );

    this.adminRouter.delete(
      AdminRoutes.DELETE_SUBSCRIPTION,
      adminOnly,
      (req, res) => subscriptionController.deleteSubscription(req, res)
    );
    this.adminRouter.get(
      AdminRoutes.BOOKED_SUBSCRIPTION,
      adminOnly,
      (req, res) => subscriptionController.getAllSubscriptionBookings(req, res)
    );

    // -------------------- WALLET MANAGEMENT --------------------

    this.adminRouter.post(AdminRoutes.ADMIN_WALLET, adminOnly, (req, res) =>
      walletcontroller.createWallet(req, res)
    );

    this.adminRouter.get(
      AdminRoutes.GET_ADMIN_WALLET,
      checkRoleBasedcontrol([Role.ADMIN, Role.VENDOR, Role.USER]),
      (req, res) => walletcontroller.GetWallet(req, res)
    );

    this.adminRouter.post(AdminRoutes.TRANSFER_AMOUNT, adminOnly, (req, res) =>
      walletcontroller.TransferWalletAmount(req, res)
    );

    this.adminRouter.get(
      AdminRoutes.COMPLETED_BOOKINGS,
      checkRoleBasedcontrol([Role.ADMIN, Role.VENDOR, Role.USER]),
      (req, res) => walletcontroller.getCompletedBookingsForTransfer(req, res)
    );

    this.adminRouter.post(
      AdminRoutes. COMPLETED_TRIP,(req,res)=>walletcontroller.completeTripAndDistribute(req,res)
    )

    // -------------------- BUDDY TRAVEL PACKAGE MANAGEMENT --------------------

    this.adminRouter.patch(
      AdminRoutes.UPDATE_PACKAGE_STATUS,
      checkRoleBasedcontrol([Role.ADMIN, Role.VENDOR]),
      (req, res) => buddyTravelcontroller.updateBuddyPackageStatus(req, res)
    );

    this.adminRouter.get(
      AdminRoutes.GET_BUDDY_PACKAGES,
      checkRoleBasedcontrol([Role.ADMIN, Role.VENDOR]),
      (req, res) => buddyTravelcontroller.getBuddyTravelPackages(req, res)
    );
  }
}
