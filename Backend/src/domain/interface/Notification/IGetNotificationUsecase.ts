import { NotificationDto } from "../../dto/Notification/NotificationDto";

export interface IGetNotification {
  execute(recipientId: string,recipientType: "vendor" | "user"): Promise<NotificationDto[]>;
}
