import { Request, Response, Router } from "express";
import {
  adminController,
  adminVendorController,
  getAllVendorsController,
  getVendorsByStatusController,
  updateVendorStatusController,
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
      "/vendors/:email/status",
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
  }
}
