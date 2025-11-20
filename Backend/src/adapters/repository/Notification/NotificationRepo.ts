import { INotificationRepository } from "../../../domain/interface/Notification/INotificationRepo";
import { NotificationModel } from "../../../framework/database/Models/NotificationModel";
import { Notification as NotificationEntity } from "../../../domain/entities/NotificationEntity";

export class NotificationRepository implements INotificationRepository {
  async save(notification: NotificationEntity): Promise<NotificationEntity> {
    const newNotification = new NotificationModel(notification);
    const saved = await newNotification.save();

    return (
      typeof saved.toObject === "function" ? saved.toObject() : saved
    ) as NotificationEntity;
  }
  async findByRecipient(
    recipientId: string,
    recipientType: string
  ): Promise<NotificationEntity[]> {
    const notifications = await NotificationModel.find({
      recipientId,
      recipientType,
    })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return notifications;
  }
  async removeToken(token: string): Promise<void> {
    await NotificationModel.updateMany(
      { tokens: token },
      { $pull: { tokens: token } }
    ).exec();
  }
}
