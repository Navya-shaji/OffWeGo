// import { INotificationService } from "../../domain/interface/Notification/INotificationService";
// import { NotificationDto } from "../../domain/dto/Notification/NotificationDto";
// import { INotification } from "../../domain/entities/NotificationEntity";
// import { INotificationRepository } from "../../domain/interface/Notification/INotificationRepo";


// export class NotificationService implements INotificationService {

//   constructor(
//     private _notificationRepo: INotificationRepository,
//     private _notificationManager: INotificationManagerAdapter
//   ) {}

//   async send(notification: NotificationDto): Promise<INotification[]> {
//     // Save in DB
//     const saved = await this._notificationRepo.create({
//       from: notification.from,
//       to: notification.to,
//       message: notification.message,
//       read: notification.read,
//       senderModel: notification.senderModel,
//       receiverModel: notification.receiverModel,
//       type: notification.type
//     });

//     // Prepare live notification structure
//     const live: LiveNotificationDto = {
//       _id: saved._id?.toString() || "",
//       from: saved.from.toString(),
//       to: saved.to.toString(),
//       message: saved.message,
//       type: saved.type
//     };

//     // Emit it (Socket.IO or WS)
//     this._notificationManager.sendLiveNotification(live);

//     return [saved]; // as Promise<INotification[]>
//   }

//   async getByRecipient(
//     recipientId: string,
//     recipientType: "vendor" | "user"
//   ): Promise<INotification[]> {
//     return this._notificationRepo.findByRecipient(recipientId, recipientType);
//   }
// }
