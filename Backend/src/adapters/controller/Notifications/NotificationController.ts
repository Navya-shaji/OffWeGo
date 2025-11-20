import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { ISendNotificationUseCase } from "../../../domain/interface/Notification/ISendNotification";
import { Notification } from "../../../domain/entities/NotificationEntity";

export class NotificationController {
  constructor(private _sendNotificationUseCase: ISendNotificationUseCase) {}

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
}
