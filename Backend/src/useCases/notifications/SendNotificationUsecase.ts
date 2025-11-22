import { INotificationService } from "../../domain/interface/Notification/INotificationService";
import { ISendNotificationUseCase } from "../../domain/interface/Notification/ISendNotification";
import { NotificationDto } from "../../domain/dto/Notification/NotificationDto";
import { notificationMapperDto } from "../../mappers/Notification/notificationMapper";

export class SendNotificationUseCase implements ISendNotificationUseCase {
  constructor(private _notificationService: INotificationService) {}

  async execute(notification: NotificationDto): Promise<NotificationDto[]> {
    const res = await this._notificationService.send(notification);
    return notificationMapperDto(res); 
  }
}
