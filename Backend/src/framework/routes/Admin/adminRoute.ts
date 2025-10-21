import { Request, Response, Router } from "express";
import {
  adminController,
  AdminuserController,
  adminVendorController,
  bannerController,
  categoryController,
  destinationController,
  subscriptionController,
} from "../../Di/Admin/adminInjection";

import { verifyTokenAndCheckBlackList } from "../../../adapters/flowControl/TokenValidationControl";
import { JwtService } from "../../Services/jwtService";
import { AdminRoutes } from "../Constants/AdminRouteConstants";
import { checkRoleBasedcontrol } from "../../../adapters/flowControl/RoleBasedControl";
import { CommonRoutes } from "../Constants/commonRoutes";
import { refreshTokenController } from "../../Di/RefreshToken/refreshtokenInjection";
const TokenService = new JwtService();

export class AdminRoute {
  public adminRouter: Router;

  constructor() {
    this.adminRouter = Router();
    this.setRoutes();
  }

  private setRoutes(): void {
    this.adminRouter.post(AdminRoutes.LOGIN, (req: Request, res: Response) => {
      adminController.login(req, res);
    });
    this.adminRouter.post(
      CommonRoutes.REFRESH_TOKEN,
      (req: Request, res: Response) => {
        refreshTokenController.handle(req, res);
      }
    );

    this.adminRouter.get(
      AdminRoutes.GET_DESTINATIONS,
      (req: Request, res: Response) => {
        destinationController.getAllDestination(req, res);
      }
    );
    this.adminRouter.get(
      AdminRoutes.GET_ALL_BANNERS,
      (req: Request, res: Response) => {
        bannerController.getBanners(req, res);
      }
    );
    this.adminRouter.use(verifyTokenAndCheckBlackList(TokenService));
    this.adminRouter.get(
      AdminRoutes.SEARCH_VENDOR,
      checkRoleBasedcontrol(["admin"]),
      (req: Request, res: Response) => {
        adminVendorController.searchVendor(req, res);
      }
    );

    this.adminRouter.get(
      AdminRoutes.GET_VENDOR_BY_EMAIL,
      checkRoleBasedcontrol(["admin"]),
      (req: Request, res: Response) => {
        adminVendorController.getVendorByEmail(req, res);
      }
    );

    this.adminRouter.patch(
      AdminRoutes.ADMIN_VENDOR_APPROVAL,
      checkRoleBasedcontrol(["admin"]),
      (req: Request, res: Response) => {
        adminVendorController.updateVendorApprovalStatus(req, res);
      }
    );

    this.adminRouter.get(
      AdminRoutes.GET_ALL_VENDORS,
      checkRoleBasedcontrol(["admin"]),
      (req: Request, res: Response) => {
        adminVendorController.getAllVendors(req, res);
      }
    );

    this.adminRouter.get(
      AdminRoutes.GET_VENDOR_BY_STATUS,
      checkRoleBasedcontrol(["admin"]),
      (req: Request, res: Response) => {
        adminVendorController.getVendorsByStatus(req, res);
      }
    );

    this.adminRouter.get(
      AdminRoutes.GET_ALL_USERS,
      checkRoleBasedcontrol(["admin"]),
      (req: Request, res: Response) => {
        AdminuserController.getAllUsers(req, res);
      }
    );

    this.adminRouter.get(
      AdminRoutes.SEARCH_USER,
      checkRoleBasedcontrol(["admin"]),
      (req: Request, res: Response) => {
        AdminuserController.searchUser(req, res);
      }
    );

    this.adminRouter.patch(
      AdminRoutes.UPDATE_USER_STATUS,
      checkRoleBasedcontrol(["admin"]),
      (req: Request, res: Response) => {
        AdminuserController.updateStatus(req, res);
      }
    );

    this.adminRouter.post(
      AdminRoutes.CREATE_DESTINATION,

      (req: Request, res: Response) => {
        destinationController.addDestination(req, res);
      }
    );

    this.adminRouter.put(
      AdminRoutes.EDIT_DESTINATION,
      checkRoleBasedcontrol(["vendor", "admin"]),
      (req: Request, res: Response) => {
        destinationController.editDestinationHandler(req, res);
      }
    );

    this.adminRouter.get(
      AdminRoutes.SEARCH_DESTINATION,
      (req: Request, res: Response) => {
        destinationController.searchDestination(req, res);
      }
    );

    this.adminRouter.patch(
      AdminRoutes.BLOCK_UNBLOCK_VENDOR,
      checkRoleBasedcontrol(["admin"]),
      (req: Request, res: Response) => {
        adminVendorController.blockOrUnblockVendor(req, res);
      }
    );

    this.adminRouter.post(
      AdminRoutes.CREATE_CATEGORY,
      checkRoleBasedcontrol(["admin"]),
      (req: Request, res: Response) => {
        categoryController.createCategory(req, res);
      }
    );

    this.adminRouter.get(
      AdminRoutes.GET_ALL_CATEGORIES,
      checkRoleBasedcontrol(["admin"]),
      (req: Request, res: Response) => {
        categoryController.getCategories(req, res);
      }
    );

    this.adminRouter.get(
      AdminRoutes.SEARCH_CATEGORY,
      checkRoleBasedcontrol(["admin"]),
      (req: Request, res: Response) => {
        categoryController.SearchCategory(req, res);
      }
    );

    this.adminRouter.post(
      AdminRoutes.CREATE_BANNER,
      checkRoleBasedcontrol(["admin"]),
      (req: Request, res: Response) => {
        bannerController.createBanner(req, res);
      }
    );

    this.adminRouter.delete(
      AdminRoutes.DELETE_DESTINATION,
      verifyTokenAndCheckBlackList(TokenService),
      checkRoleBasedcontrol(["vendor", "admin"]),
      (req: Request, res: Response) => {
        destinationController.deleteDestinationController(req, res);
      }
    );

    this.adminRouter.put(
      AdminRoutes.EDIT_CATEGORY,
      checkRoleBasedcontrol(["admin"]),
      (req: Request, res: Response) => {
        categoryController.EditCategory(req, res);
      }
    );

    this.adminRouter.delete(
      AdminRoutes.DELETE_CATEGORY,
      checkRoleBasedcontrol(["admin"]),
      (req: Request, res: Response) => {
        categoryController.DeleteCategory(req, res);
      }
    );

    this.adminRouter.put(
      AdminRoutes.EDIT_BANNER,
      checkRoleBasedcontrol(["admin"]),
      (req: Request, res: Response) => {
        bannerController.editBanner(req, res);
      }
    );

    this.adminRouter.delete(
      AdminRoutes.DELETE_BANNER,
      checkRoleBasedcontrol(["admin"]),
      (req: Request, res: Response) => {
        bannerController.bannerDelete(req, res);
      }
    );

    this.adminRouter.patch(
      AdminRoutes.BANNER_ACTIONS,
      (req: Request, res: Response) => {
        bannerController.bannerAction(req, res);
      }
    );
    this.adminRouter.post(
      AdminRoutes.CREATE_SUBSCRIPTION,
      checkRoleBasedcontrol(["admin"]),
      (req: Request, res: Response) => {
        subscriptionController.createSubscription(req, res);
      }
    );

    this.adminRouter.get(
      AdminRoutes.GET_ALL_SUBSCRIPTIONS,
      checkRoleBasedcontrol(["admin"]),
      (req: Request, res: Response) => {
        subscriptionController.getAllSubscriptions(req, res);
      }
    );
    this.adminRouter.put(
      AdminRoutes.EDIT_SUBSCRIPTION,
      checkRoleBasedcontrol(["admin"]),
      (req: Request, res: Response) => {
        subscriptionController.updateSubscription(req, res);
      }
    );
    // this.adminRouter.delete(
    //   AdminRoutes.DELETE_SUBSCRIPTION,
    //   checkRoleBasedcontrol(["admin"]),
    //   (req:Request,res:Response)=>{
    //     subscriptionController.deleteDestinationController(req,res)
    //   }
    // )
  }
}
