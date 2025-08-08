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
    this.adminRouter.use(verifyTokenAndCheckBlackList(TokenService));


  this.adminRouter.get('/destinations', (req: Request, res: Response) => {
    destinationController.getAllDestination(req, res);
  });


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
    AdminuserController.getAllUsers(req, res);
  });

  this.adminRouter.patch("/user/status/:id", (req: Request, res: Response) => {
    AdminuserController.updateStatus(req, res);
  });

  this.adminRouter.post('/create-destination', (req: Request, res: Response) => {
    destinationController.addDestination(req, res);
  });

  this.adminRouter.put('/edit/:id', (req: Request, res: Response) => {
    destinationController.editDestinationHandler(req, res);
  });

  this.adminRouter.patch("/vendors/isBlocked/:id", (req: Request, res: Response) => {
    adminVendorController.blockOrUnblockVendor(req,res)
  });

  this.adminRouter.post("/create-categories", (req: Request, res: Response) => {
    categoryController.createCategory(req, res);
  });

  this.adminRouter.get("/categories", (req: Request, res: Response) => {
    categoryController.getCategories(req, res);
  });

  this.adminRouter.post("/create-banner", (req: Request, res: Response) => {
    bannerController.CreateBanner(req, res);
  });

  this.adminRouter.get("/banner", (req: Request, res: Response) => {
    bannerController.getBanners(req, res);
  });
  this.adminRouter.delete('/destination/:id',(req:Request,res:Response)=>{
    destinationController.deleteDestinationController(req,res)
  })
  this.adminRouter.put("/category/:id",(req:Request,res:Response)=>{
    categoryController.EditCategory(req,res)
  })
  this.adminRouter.delete("/category/:id",(req:Request,res:Response)=>{
    categoryController.DeleteCategory(req,res)
  })
  this.adminRouter.put("/banner/:id",(req:Request,res:Response)=>{
    bannerController.EditBanner(req,res)
  })
  this.adminRouter.delete("/banner/:id",(req:Request,res:Response)=>{
    bannerController.BannerDelete(req,res)
  })
  this.adminRouter.post("/create-subscription",(req:Request,res:Response)=>{
    subscriptionController.createSubscription(req,res)
  })
  this.adminRouter.get("/subscriptions",(req:Request,res:Response)=>{
    subscriptionController.getAllSubscriptions(req,res)
  })
}

}
