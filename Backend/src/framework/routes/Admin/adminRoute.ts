import { Request, Response, Router } from "express";
import {
  adminController,
  adminVendorController,
  catogoryController,
  createBannerController,
  destinationController,
  editDestinationController,
  getallbannercontroller,
  getallCategoryController,
  getAllUsersController,
  // getAllVendorsController,
  getDestinationController,
  // getVendorsByStatusController,
  userstatusController,
  // vendorblockUnblockController,
} from "../../../framework/Di/admin/adminInjection";

import { verifyTokenAndCheckBlackList } from "../../../adapters/FlowControl/TokenValidationControl";
import { JwtSevice } from "../../services/jwtService";
// import { updateVendorStatusController } from "../../Di/Vendor/VendorInjections";
const TokenService = new JwtSevice();

export class AdminRoute {
  public adminRouter: Router;

  constructor() {
    this.adminRouter = Router();
    this.setRoutes();
  }

  private setRoutes(): void {
 
  this.adminRouter.post("/login", (req: Request, res: Response) => {
    adminController.login(req, res);
  });


  this.adminRouter.get('/destinations', (req: Request, res: Response) => {
    getDestinationController.getAllDestination(req, res);
  });

  this.adminRouter.use(verifyTokenAndCheckBlackList(TokenService));

  this.adminRouter.get("/vendors/:email", (req: Request, res: Response) => {
    adminVendorController.getVendorByEmail(req,res)
  });

  this.adminRouter.patch("/vendors/status/:id", (req: Request, res: Response) => {
    adminVendorController.updateVendorApprovalStatus(req,res)
  });

  this.adminRouter.get("/vendors", (req: Request, res: Response) => {
    adminVendorController.getAllVendors(req, res);
  });

  this.adminRouter.get("/vendors/status/:status", (req: Request, res: Response) => {
    adminVendorController.getVendorsByStatus(req, res);
  });

  this.adminRouter.get("/users", (req: Request, res: Response) => {
    getAllUsersController.getAllUsers(req, res);
  });

  this.adminRouter.patch("/user/status/:id", (req: Request, res: Response) => {
    userstatusController.updateStatus(req, res);
  });

  this.adminRouter.post('/create-destination', (req: Request, res: Response) => {
    destinationController.addDestination(req, res);
  });

  this.adminRouter.put('/edit/:id', (req: Request, res: Response) => {
    editDestinationController.editDestinationHandler(req, res);
  });

  this.adminRouter.patch("/vendors/isBlocked/:id", (req: Request, res: Response) => {
    adminVendorController.blockOrUnblockVendor(req,res)
  });

  this.adminRouter.post("/create-categories", (req: Request, res: Response) => {
    catogoryController.createCategory(req, res);
  });

  this.adminRouter.get("/categories", (req: Request, res: Response) => {
    getallCategoryController.getCategories(req, res);
  });

  this.adminRouter.post("/create-banner", (req: Request, res: Response) => {
    createBannerController.CreateBanner(req, res);
  });

  this.adminRouter.get("/banner", (req: Request, res: Response) => {
    getallbannercontroller.getBanners(req, res);
  });
}

}
