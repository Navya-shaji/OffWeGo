import { Notification as NotificationEntity } from "../../../domain/entities/NotificationEntity";

export interface IGetNotification {
  execute(recipientType: string): Promise<NotificationEntity[]>;
}
