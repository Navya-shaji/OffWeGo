
import { model, Document, ObjectId } from "mongoose";
import { INotificationEntity } from "../../../domain/entities/NotificationEntity";
import { NotificationSchema } from "../Schema/NotificationSchema";

export interface INotificationModel extends Omit<INotificationEntity, "_id">, Document {
  _id: ObjectId;
}

export const NotificationModel = model<INotificationModel>(
  "Notification",
  NotificationSchema
);
