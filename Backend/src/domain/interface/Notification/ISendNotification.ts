import { NotificationDto } from "../../dto/Notification/NotificationDto";
import { INotificationEntity } from "../../entities/NotificationEntity";

export interface INotificationService {
  send(notification: NotificationDto): Promise<INotificationEntity[]>;
  
  getByRecipient(
    recipientId: string,
    recipientType: "user" | "vendor"
  ): Promise<INotificationEntity[]>;
}
