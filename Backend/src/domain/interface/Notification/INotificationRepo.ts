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

  getByRecipient(
    recipientId: string,
    recipientType: "user" | "vendor"
  ): Promise<INotificationEntity[]>;

  markAsRead(id: string): Promise<INotificationEntity | null>;

  markAllAsRead(
    recipientId: string,
    recipientType: "user" | "vendor"
  ): Promise<{ modifiedCount: number }>;

  getUnreadCount(
    recipientId: string,
    recipientType: "user" | "vendor"
  ): Promise<number>;

  deleteNotification(id: string): Promise<{ deletedCount: number }>;

  deleteAllNotifications(
    recipientId: string,
    recipientType: "user" | "vendor"
  ): Promise<{ deletedCount: number }>;
}
