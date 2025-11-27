import { INotificationEntity } from "../../entities/NotificationEntity";

export interface INotificationRepository {
  create(data: INotificationEntity): Promise<INotificationEntity>;

  findAll(): Promise<INotificationEntity[]>;

  findById(id: string): Promise<INotificationEntity | null>;

  update(
    id: string,
    data: Partial<INotificationEntity>
  ): Promise<INotificationEntity | null>;

  delete(id: string): Promise<INotificationEntity | null>;

  findOne(
    filter: Partial<INotificationEntity>
  ): Promise<INotificationEntity | null>;

  // ⭐ Fetch notifications by user/vendor
  getByRecipient(
    recipientId: string,
    recipientType: "user" | "vendor"
  ): Promise<INotificationEntity[]>;

  // ⭐ Mark one as read
  markAsRead(id: string): Promise<INotificationEntity | null>;

  // ⭐ Mark all as read for user/vendor
  markAllAsRead(
    recipientId: string,
    recipientType: "user" | "vendor"
  ): Promise<{ modifiedCount: number }>;

  // ⭐ Get unread count
  getUnreadCount(
    recipientId: string,
    recipientType: "user" | "vendor"
  ): Promise<number>;

  // ⭐ Delete single notification
  deleteNotification(
    id: string
  ): Promise<{ deletedCount: number }>;

  // ⭐ Delete all notifications of user/vendor
  deleteAllNotifications(
    recipientId: string,
    recipientType: "user" | "vendor"
  ): Promise<{ deletedCount: number }>;
}
