
import { Request, Response, Router } from "express";
import {adminController} from '../../../framework/Di/admin/adminInjection'
export class AdminRoute{
  public adminRouter: Router;

  constructor() {
    this.adminRouter = Router();
    this.setRoutes()
  }

  private setRoutes(): void {
   this.adminRouter.post("/login",(req:Request,res:Response)=>{
    
    adminController.login(req, res);
   })
  }
}