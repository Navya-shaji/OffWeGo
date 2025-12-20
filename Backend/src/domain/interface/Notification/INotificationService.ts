import { NotificationDto } from "../../dto/Notification/NotificationDto";

export interface ISendNotificationUseCase {
  execute(notification: NotificationDto): Promise<NotificationDto[]>;
}
