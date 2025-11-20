import { INotificationRepository } from "../../../domain/interface/Notification/INotificationRepo";
import { NotificationModel } from "../../../framework/database/Models/NotificationModel";
import { Notification as NotificationEntity } from "../../../domain/entities/NotificationEntity";


export class NotificationRepository implements INotificationRepository {

  async save(notification: NotificationEntity): Promise<NotificationEntity> {
    const newNotification = new NotificationModel(notification);
    const saved = await newNotification.save();
 
    return (typeof saved.toObject === "function" ? saved.toObject() : saved) as NotificationEntity;
  }


  async getAllForUser(userId: string): Promise<NotificationEntity[]> {
    const docs = await NotificationModel.find({ recipientId: userId }).sort({ createdAt: -1 }).exec();
    return docs.map(d => (typeof (d as any).toObject === "function" ? (d as any).toObject() : d) as NotificationEntity);
  }

 
  async removeToken(token: string): Promise<void> {
    await NotificationModel.updateMany(
      { tokens: token },
      { $pull: { tokens: token } }
    ).exec();
  }
}
