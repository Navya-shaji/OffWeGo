import { Role } from "../../../domain/constants/Roles";
import { INotificationEntity } from "../../../domain/entities/NotificationEntity";
import { INotificationRepository } from "../../../domain/interface/Notification/INotificationRepo";
import { NotificationModel } from "../../../framework/database/Models/NotificationModel";

export class NotificationRepository implements INotificationRepository {
  async create(data: INotificationEntity): Promise<INotificationEntity> {
    const doc = await NotificationModel.create(data);
    return doc.toObject() as unknown as INotificationEntity;
  }

  async findAll(): Promise<INotificationEntity[]> {
    return await NotificationModel.find();
  }

  async findById(id: string): Promise<INotificationEntity | null> {
    return await NotificationModel.findById(id);
  }

  async update(
    id: string,
    data: Partial<INotificationEntity>
  ): Promise<INotificationEntity | null> {
    return await NotificationModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<INotificationEntity | null> {
    return await NotificationModel.findByIdAndDelete(id);
  }

  async findOne(
    filter: Partial<INotificationEntity>
  ): Promise<INotificationEntity | null> {
    return await NotificationModel.findOne(filter);
  }
  async getByRecipient(
    recipientId: string,
    recipientType: Role.USER | Role.VENDOR
  ): Promise<INotificationEntity[]> {
    if (!recipientId || !recipientType) {
      console.warn(" getByRecipient called with missing parameters:", { recipientId, recipientType });
      return [];
    }

    const query = { 
      recipientId: String(recipientId), 
      recipientType: recipientType 
    };
    
    console.log(` Fetching notifications with query:`, query);
    
    const docs = await NotificationModel.find(query)
      .sort({ createdAt: -1 })
      .lean();

    console.log(` Found ${docs.length} notifications for ${recipientType} with ID ${recipientId}`);
    
    return docs as unknown as INotificationEntity[];
  }

  async markAsRead(id: string): Promise<INotificationEntity | null> {
    return await NotificationModel.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );
  }

  async markAllAsRead(recipientId: string, recipientType: Role.USER | Role.VENDOR) {
    const result = await NotificationModel.updateMany(
      { recipientId, recipientType, read: false },
      { read: true }
    );

    return { modifiedCount: result.modifiedCount };
  }

  async getUnreadCount(recipientId: string, recipientType: Role.USER | Role.VENDOR) {
    return await NotificationModel.countDocuments({
      recipientId,
      recipientType,
      read: false,
    });
  }

  async deleteNotification(id: string) {
    const result = await NotificationModel.deleteOne({ _id: id });
    return { deletedCount: result.deletedCount };
  }

  async deleteAllNotifications(
    recipientId: string,
    recipientType: Role.USER | Role.VENDOR
  ) {
    const result = await NotificationModel.deleteMany({
      recipientId,
      recipientType,
    });
    return { deletedCount: result.deletedCount };
  }
}
