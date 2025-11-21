import { Notification } from "../../entities/NotificationEntity";


export interface INotificationRepository {
  save(notification: Notification): Promise<Notification>;
  findByRecipient( recipientType: string): Promise<Notification[]>;
  removeToken(token: string): Promise<void>;
}

