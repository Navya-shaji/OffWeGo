import { INotificationService } from "../../domain/interface/Notification/INotificationService";
import { Notification } from "../../domain/entities/NotificationEntity";
import { firebaseAdmin } from "./firebase";
import { INotificationRepository } from "../../domain/interface/Notification/INotificationRepo";
import { Role } from "../../domain/constants/Roles";

export class FirebaseNotificationService implements INotificationService {
  constructor(private _notificationRepo: INotificationRepository) {}

  async send(notification: Notification): Promise<void> {
    try {
    
      if (notification.tokens && notification.tokens.length > 0) {
        const validTokens = notification.tokens.filter(t => t && t.length > 0);

        if (validTokens.length > 0) {
          const response = await firebaseAdmin.messaging().sendEachForMulticast({
            notification: { title: notification.title, body: notification.body },
            tokens: validTokens,
          });

          console.log(`Notifications sent: ${response.successCount}`);
          
          response.responses.forEach(async (resp, idx) => {
            if (!resp.success) {
              console.warn(` Token ${validTokens[idx]} failed:`, resp.error);
              if (resp.error?.code === "messaging/registration-token-not-registered") {
                await this._notificationRepo.removeToken(validTokens[idx]);
              }
            }
          });
        }
      }


      if (notification.topic) {
        await firebaseAdmin.messaging().send({
          notification: { title: notification.title, body: notification.body },
          topic: notification.topic,
        });
        console.log(` Notification sent to topic: ${notification.topic}`);
      }

    
      await this._notificationRepo.save(notification);
    } catch (error) {
      console.error(" Error sending notifications:", error);
      throw new Error("Failed to send notification");
    }
  }

    async getByRecipient(
   
    recipientType:Role
  ): Promise<Notification[]> {
    try {
      return this._notificationRepo.findByRecipient( recipientType);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw new Error("Failed to fetch notifications");
    }
  }
}
