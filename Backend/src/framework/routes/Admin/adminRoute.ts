import { Request, Response, Router } from "express";
import {
  adminController,
  adminVendorController,
  destinationController,
  editDestinationController,
  getAllUsersController,
  getAllVendorsController,
  getDestinationController,
  getVendorsByStatusController,
  updateVendorStatusController,
  userstatusController,
} from "../../../framework/Di/admin/adminInjection";

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
    this.adminRouter.get("/vendors/:email", (req: Request, res: Response) => {
      adminVendorController.getvendorByEmail(req, res);
    });
    this.adminRouter.patch(
      "/vendors/status/:id",
      (req: Request, res: Response) => {
        updateVendorStatusController.VendorStatusController(req, res);
      }
    );
    this.adminRouter.get("/vendors", (req: Request, res: Response) => {
      getAllVendorsController.getAllVendors(req, res);
    });
    this.adminRouter.get(
      "/vendors/status/:status",
      (req: Request, res: Response) => {
        getVendorsByStatusController.getVendorsByStatus(req, res);
      }
    );
    this.adminRouter.get("/users", (req: Request, res: Response) => {
      getAllUsersController.getAllUsers(req, res);
    });
    this.adminRouter.patch("/user/status/:id", (req: Request, res: Response) =>
      userstatusController.updateStatus(req, res)
    );
    this.adminRouter.get("/vendors",(req:Request,res:Response)=>{
      getAllVendorsController.getAllVendors(req,res)
    })
    this.adminRouter.post('/create-destination',(req:Request,res:Response)=>{
      destinationController.addDestination(req,res)
    })
    this.adminRouter.get('/destinations',(req:Request,res:Response)=>{
      getDestinationController.getAllDestination(req,res)
    })
    this.adminRouter.put('/edit/:id',(req:Request,res:Response)=>{
      editDestinationController.editDestinationHandler(req,res)
    })
  }
}
