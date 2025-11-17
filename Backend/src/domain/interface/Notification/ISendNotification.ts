import { Notification } from "../../entities/NotificationEntity";

export interface ISendNotificationUseCase {
  execute(notification: Notification): Promise<void>;
}
