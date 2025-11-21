import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { ISendNotificationUseCase } from "../../../domain/interface/Notification/ISendNotification";
import { Notification } from "../../../domain/entities/NotificationEntity";
import { IGetNotification } from "../../../domain/interface/Notification/IGetNotificationUsecase";

export class NotificationController {
  constructor(private _sendNotificationUseCase: ISendNotificationUseCase,
    private _getNotificationUseCase:IGetNotification
  ) {}

  async sendNotification(req: Request, res: Response): Promise<void> {
    try {
      const notification: Notification = req.body;

      await this._sendNotificationUseCase.execute(notification);

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Notification sent successfully",
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  
  async getNotifications(req: Request, res: Response): Promise<void> {
    try {
      const recipientType =req.body.recipientType
    console.log(recipientType,"h")
    

      const notifications = await this._getNotificationUseCase.execute(
        recipientType ,
        
      );
      console.log(notifications,"n")

      res.status(HttpStatus.OK).json({
        success: true,
        data: notifications,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }
}
