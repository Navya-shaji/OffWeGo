import { NotificationDto } from "../../dto/Notification/NotificationDto";
import { INotification } from "../../entities/NotificationEntity";

export interface INotificationService {
  send(notification: NotificationDto): Promise<INotification[]>;

  getByRecipient(
    recipientId: string,
    recipientType: "vendor" | "user"
  ): Promise<INotification[]>;
}
