import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { IGetNotification } from "../../../domain/interface/Notification/IGetNotificationUsecase";
import { ISendNotificationUseCase } from "../../../domain/interface/Notification/INotificationService";
import { IReadNotificationusecase } from "../../../domain/interface/Notification/IReadNotificationusecase";

export class NotificationController {
  constructor(
    private _sendNotificationUseCase: ISendNotificationUseCase,
    private _getNotificationUseCase: IGetNotification,
    private _readNotifictaionUsecase: IReadNotificationusecase
  ) { }

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
      const recipientId = req.body.recipientId

      const notifications = await this._getNotificationUseCase.execute(
        recipientId,
        recipientType
      );

      res.status(HttpStatus.OK).json({
        success: true,
        data: notifications,
      });
    } catch (error) {
      console.error(" Error fetching notifications:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  async readNotifications(req: Request, res: Response): Promise<void> {
    try {
      const Id = req.params.notificationId;
      const result = await this._readNotifictaionUsecase.execute(Id);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }
}
