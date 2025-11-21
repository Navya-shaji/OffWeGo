import { NotificationDto } from "../../domain/dto/Notification/NotificationDto";
import { IGetNotification } from "../../domain/interface/Notification/IGetNotificationUsecase";
import { INotificationRepository } from "../../domain/interface/Notification/INotificationRepo";
import { notificationMapperDto } from "../../mappers/Notification/notificationMapper";

export class GetNotificationUseCase implements IGetNotification {
  constructor(private notificationRepo: INotificationRepository) {}

  async execute( recipientType: string): Promise<NotificationDto[]> {
    const notifications = await this.notificationRepo.findByRecipient(recipientType);
    console.log(notifications,"fff")
    return notificationMapperDto(notifications)
  }
}
