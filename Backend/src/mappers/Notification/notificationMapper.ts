import { Notification } from "../../domain/entities/NotificationEntity";
import { NotificationDto } from "../../domain/dto/Notification/NotificationDto";

export const notificationMapperDto = (notifications: Notification[]): NotificationDto[] => {
  return notifications.map(n => ({
    title: n.title,
    body: n.body,
    recipientType: n.recipientType,
    tokens: n.tokens,
    topic: n.topic,
    createdAt: n.createdAt,
  }));
};
