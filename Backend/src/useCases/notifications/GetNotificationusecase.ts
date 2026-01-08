import { NotificationDto } from "../../domain/dto/Notification/NotificationDto";
import { IGetNotification } from "../../domain/interface/Notification/IGetNotificationUsecase";
import { INotificationService } from "../../domain/interface/Notification/ISendNotification";
import { notificationMapperDto } from "../../mappers/Notification/notificationMapper";

export class GetNotificationUseCase implements IGetNotification {
  constructor(private notificatioService: INotificationService) {}

  async execute(recipientId: string, recipientType: "vendor" | "user"): Promise<NotificationDto[]> {
    const notifications = await this.notificatioService.getByRecipient(recipientId, recipientType);
    return notificationMapperDto(notifications)
  }
}
