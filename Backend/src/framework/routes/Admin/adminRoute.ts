import { Request, Response, Router } from "express";
import {
  adminController,
  AdminuserController,
  adminVendorController,
  bannerController,
  categoryController,
  destinationController,
  subscriptionController,
  

} from "../../../framework/Di/admin/adminInjection";

import { verifyTokenAndCheckBlackList } from "../../../adapters/FlowControl/TokenValidationControl";
import { JwtSevice } from "../../services/jwtService";
const TokenService = new JwtSevice();
import { AdminRoutes } from "../Constants/AdminRouteConstants";

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
    this.adminRouter.get(AdminRoutes.SEARCH_VENDOR,(req:Request,res:Response)=>{
      adminVendorController.searchVendor(req,res)
    })
    this.adminRouter.use(verifyTokenAndCheckBlackList(TokenService));


  this.adminRouter.get(AdminRoutes.GET_DESTINATIONS, (req: Request, res: Response) => {
    destinationController.getAllDestination(req, res);
  });


  this.adminRouter.get(AdminRoutes.GET_VENDOR_BY_EMAIL, (req: Request, res: Response) => {
    adminVendorController.getVendorByEmail(req,res)
  });

  this.adminRouter.patch(AdminRoutes.ADMIN_VENDOR_APPROVAL, (req: Request, res: Response) => {
    adminVendorController.updateVendorApprovalStatus(req,res)
  });

  this.adminRouter.get(AdminRoutes.GET_ALL_VENDORS, (req: Request, res: Response) => {
    adminVendorController.getAllVendors(req, res);
  });
  this.adminRouter.get(AdminRoutes.GET_VENDOR_BY_STATUS, (req: Request, res: Response) => {
    adminVendorController.getVendorsByStatus(req, res);
  });

  this.adminRouter.get(AdminRoutes.GET_ALL_USERS, (req: Request, res: Response) => {
    AdminuserController.getAllUsers(req, res);
  });

  this.adminRouter.get(AdminRoutes.SEARCH_USER,(req:Request,res:Response)=>{
    AdminuserController.searchUser(req,res)
  })
  this.adminRouter.patch(AdminRoutes.UPDATE_USER_STATUS, (req: Request, res: Response) => {
    AdminuserController.updateStatus(req, res);
  });

  this.adminRouter.post(AdminRoutes.CREATE_DESTINATION, (req: Request, res: Response) => {
    destinationController.addDestination(req, res);
  });

  this.adminRouter.put(AdminRoutes.EDIT_DESTINATION, (req: Request, res: Response) => {
    destinationController.editDestinationHandler(req, res);
  });

  this.adminRouter.patch(AdminRoutes.BLOCK_UNBLOCK_VENDOR, (req: Request, res: Response) => {
    adminVendorController.blockOrUnblockVendor(req,res)
  });

  this.adminRouter.post(AdminRoutes.CREATE_CATEGORY, (req: Request, res: Response) => {
    categoryController.createCategory(req, res);
  });

  this.adminRouter.get(AdminRoutes.GET_ALL_CATEGORIES, (req: Request, res: Response) => {
    categoryController.getCategories(req, res);
  });

  this.adminRouter.post(AdminRoutes.CREATE_BANNER, (req: Request, res: Response) => {
    bannerController.CreateBanner(req, res);
  });

  this.adminRouter.get(AdminRoutes.GET_ALL_BANNERS, (req: Request, res: Response) => {
    bannerController.getBanners(req, res);
  });
  this.adminRouter.delete(AdminRoutes.DELETE_DESTINATION,(req:Request,res:Response)=>{
    destinationController.deleteDestinationController(req,res)
  })
  this.adminRouter.put(AdminRoutes.EDIT_CATEGORY,(req:Request,res:Response)=>{
    categoryController.EditCategory(req,res)
  })
  this.adminRouter.delete(AdminRoutes.DELETE_CATEGORY,(req:Request,res:Response)=>{
    categoryController.DeleteCategory(req,res)
  })
  this.adminRouter.put(AdminRoutes.EDIT_BANNER,(req:Request,res:Response)=>{
    bannerController.EditBanner(req,res)
  })
  this.adminRouter.delete(AdminRoutes.DELETE_BANNER,(req:Request,res:Response)=>{
    bannerController.BannerDelete(req,res)
  })
  this.adminRouter.post(AdminRoutes.CREATE_SUBSCRIPTION,(req:Request,res:Response)=>{
    subscriptionController.createSubscription(req,res)
  })
  this.adminRouter.get(AdminRoutes.GET_ALL_SUBSCRIPTIONS,(req:Request,res:Response)=>{
    subscriptionController.getAllSubscriptions(req,res)
  })
}

}
