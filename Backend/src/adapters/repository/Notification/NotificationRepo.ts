// import { INotification } from "../../../domain/entities/NotificationEntity";
// import { INotificationRepository } from "../../../domain/interface/Notification/INotificationRepo";
// import { NotificationModel } from "../../../framework/database/Models/NotificationModel";


// export class NotificationRepository implements INotificationRepository {

//   async create(data: INotification): Promise<INotification> {
//     return await NotificationModel.create(data);
//   }

//   async findAll(): Promise<INotification[]> {
//     return await NotificationModel.find();
//   }

//   async findById(id: string): Promise<INotification | null> {
//     return await NotificationModel.findById(id);
//   }

//   async update(id: string, data: Partial<INotification>): Promise<INotification | null> {
//     return await NotificationModel.findByIdAndUpdate(id, data, { new: true });
//   }

//   async delete(id: string): Promise<INotification | null> {
//     return await NotificationModel.findByIdAndDelete(id);
//   }

//   async findOne(filter: Partial<INotification>): Promise<INotification | null> {
//     return await NotificationModel.findOne(filter);
//   }

//   // -----------------------------
//   // ⭐ EXTRA NOTIFICATION METHODS
//   // -----------------------------

//   async findByUserId(userId: string): Promise<INotification[]> {
//     return await NotificationModel
//       .find({ to: userId })
//       .sort({ createdAt: -1 });
//   }

//   async markAsRead(id: string): Promise<INotification | null> {
//     return await NotificationModel.findByIdAndUpdate(
//       id,
//       { read: true },
//       { new: true }
//     );
//   }

//   async markAllAsRead(
//     userId: string
//   ): Promise<{ modifiedCount: number }> {
//     const result = await NotificationModel.updateMany(
//       { to: userId, read: false },
//       { $set: { read: true } }
//     );

//     return { modifiedCount: result.modifiedCount };
//   }

//   async getUnreadCount(userId: string): Promise<number> {
//     return await NotificationModel.countDocuments({
//       to: userId,
//       read: false,
//     });
//   }

//   async deleteNotification(
//     id: string
//   ): Promise<{ deletedCount: number }> {
//     const result = await NotificationModel.deleteOne({ _id: id });
//     return { deletedCount: result.deletedCount };
//   }

//   async deleteAllNotifications(
//     userId: string
//   ): Promise<{ deletedCount: number }> {
//     const result = await NotificationModel.deleteMany({ to: userId });
//     return { deletedCount: result.deletedCount };
//   }
// }
