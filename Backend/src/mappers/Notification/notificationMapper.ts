import { NotificationDto } from "../../domain/dto/Notification/NotificationDto";
import { INotificationEntity } from "../../domain/entities/NotificationEntity";

export const notificationMapperDto = (
  notifications: INotificationEntity[]
): NotificationDto[] => {
  return notifications.map(n => ({
    id:n._id,
    recipientId: n.recipientId,
    recipientType: n.recipientType,
    title: n.title,
    message: n.message,
    createdAt: n.createdAt,
    read:n.read
  }));
};
