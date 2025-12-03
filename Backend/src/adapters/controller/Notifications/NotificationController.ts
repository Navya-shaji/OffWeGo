import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";

import { IGetNotification } from "../../../domain/interface/Notification/IGetNotificationUsecase";
import { ISendNotificationUseCase } from "../../../domain/interface/Notification/INotificationService";

export class NotificationController {
  constructor(
    private _sendNotificationUseCase: ISendNotificationUseCase,
    private _getNotificationUseCase: IGetNotification
  ) {}

  async sendNotification(req: Request, res: Response): Promise<void> {
    try {
      const notification = req.body;

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
      const recipientType = req.body.recipientType;
      const recipientId = req.body.recipientId;
      console.log(recipientId,recipientType,"jh")

      const notifications = await this._getNotificationUseCase.execute(
        recipientId,
        recipientType
      );
      console.log(notifications, "n");

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
