import { Router, Request, Response } from "express";
import { notificationcontroller } from "../../Di/User/userInjections";
import { CommonRoutes } from "../Constants/commonRoutes";

export class NotificationRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.setRoutes();
  }

  private setRoutes(): void {
  
    this.router.post(CommonRoutes.GET_NOTIFICATIONS, (req: Request, res: Response) => {
      notificationcontroller.getNotifications(req, res);
    });

  
  }
}
