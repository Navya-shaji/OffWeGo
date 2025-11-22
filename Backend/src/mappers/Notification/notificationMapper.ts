import { NotificationDto } from "../../domain/dto/Notification/NotificationDto";
import { INotification } from "../../domain/entities/NotificationEntity";

export const notificationMapperDto = (
  notifications: INotification[]
): NotificationDto[] => {
  return notifications.map(n => ({
    _id: n._id?.toString(),
    from: n.from,
    to: n.to,
    message: n.message,
    read: n.read,
    senderModel: n.senderModel,
    receiverModel: n.receiverModel,
    type: n.type
  }));
};
