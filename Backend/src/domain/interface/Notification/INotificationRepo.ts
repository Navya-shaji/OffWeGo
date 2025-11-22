import { INotification } from "../../entities/NotificationEntity";
import { IBaseRepo } from "../BaseRepo/IBaseRepo";


export interface INotificationRepository extends IBaseRepo<INotification> {
    findByUserId(userId: string): Promise<INotification[]>;
    markAsRead(id: string): Promise<INotification | null>;
    markAllAsRead(userId: string): Promise<{ modifiedCount: number }>;
    getUnreadCount(userId: string): Promise<number>;
    deleteNotification(id: string): Promise<{ deletedCount: number }>;
    deleteAllNotifications(userId: string): Promise<{ deletedCount: number }>;
}