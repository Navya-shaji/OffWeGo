import { Notification } from "../../entities/NotificationEntity";


export interface INotificationService {
  send(notification: Notification): Promise<void>;
}
