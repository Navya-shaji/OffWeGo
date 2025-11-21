import { INotificationService } from "../../domain/interface/Notification/INotificationService";
import { ISendNotificationUseCase } from "../../domain/interface/Notification/ISendNotification";
import { NotificationDto } from "../../domain/dto/Notification/NotificationDto";


export class SendNotificationUseCase implements ISendNotificationUseCase {
  constructor(private _notificationService: INotificationService) {}

  async execute(notification: NotificationDto): Promise<void> {
    await this._notificationService.send(notification);
  }
}
