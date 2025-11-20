
import { model, Document, ObjectId } from "mongoose";
import { Notification } from "../../../domain/entities/NotificationEntity";
import { NotificationSchema } from "../Schema/NotificationSchema";

export interface INotificationModel extends Omit<Notification, "_id">, Document {
  _id: ObjectId;
}

export const NotificationModel = model<INotificationModel>(
  "Notification",
  NotificationSchema
);
