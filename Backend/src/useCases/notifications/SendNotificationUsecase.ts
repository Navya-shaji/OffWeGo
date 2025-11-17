import { INotificationService } from "../../domain/interface/Notification/INotificationService";
import { ISendNotificationUseCase } from "../../domain/interface/Notification/ISendNotification";
import { Notification } from "../../domain/entities/NotificationEntity";


export class SendNotificationUseCase implements ISendNotificationUseCase {
  constructor(private _notificationService: INotificationService) {}

  async execute(notification: Notification): Promise<void> {
    await this._notificationService.send(notification);
  }
}
