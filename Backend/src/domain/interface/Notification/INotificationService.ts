import { Notification } from "../../entities/NotificationEntity";


export interface INotificationService {
  send(notification: Notification): Promise<void>;
    getByRecipient(
    recipientId: string,
    recipientType: "vendor" | "user"
  ): Promise<Notification[]>;
}
