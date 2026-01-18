import { NotificationDto } from "../../domain/dto/Notification/NotificationDto";
import { INotificationEntity } from "../../domain/entities/NotificationEntity";
import { NotificationRepository } from "../../adapters/repository/Notification/NotificationRepo";
import { UserRepository } from "../../adapters/repository/User/UserRepository";
import { VendorRepository } from "../../adapters/repository/Vendor/VendorRepository";
import { firebaseAdmin } from "./firebase";
import { INotificationService } from "../../domain/interface/Notification/ISendNotification";
export class FirebaseNotificationService implements INotificationService {
  constructor(
    private notificationRepo: NotificationRepository,
    private userRepo: UserRepository,
    private vendorRepo: VendorRepository
  ) { }

  private async sendNotification(
    token: string,
    title: string,
    body: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any
  ): Promise<void> {
    try {
      const message = {
        token,
        notification: {
          title,
          body
        },
        data: data || {},
        android: {
          priority: 'high' as const,
          notification: {
            sound: 'default',
            channelId: 'default',
          },
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1,
            },
          },
        },
        webpush: {
          notification: {
            title,
            body,
            icon: '/icon-192x192.png',
            badge: '/badge-72x72.png',
          },
        },
      };

      const response = await firebaseAdmin.messaging().send(message);
      console.log(' FCM notification sent successfully:', response);
    } catch (error: unknown) {
      const fcmError = error as { code?: string; message?: string };
      if (fcmError.code === 'messaging/invalid-registration-token' ||
        fcmError.code === 'messaging/registration-token-not-registered') {
        console.warn('⚠️ Invalid FCM token, should be removed from database');
      } else {
        // Log the error but don't throw - FCM failures shouldn't break the main flow
        console.error('❌ FCM notification failed:', fcmError.message || fcmError);
      }
    }
  }

  async send(notification: NotificationDto): Promise<INotificationEntity[]> {
    const { recipientId, recipientType, title, message } = notification;


    let token: string | null = null;
    if (recipientType === "user") {
      token = await this.userRepo.getFcmTokenById(recipientId);
    } else {
      token = await this.vendorRepo.getFcmTokenById(recipientId);
    }

    if (token && token.trim() !== '') {
      // Include additional data for foreground handling
      // FCM requires all data values to be strings
      const notificationData: Record<string, string> = {
        type: 'chat_message',
        recipientId: String(recipientId),
        recipientType: String(recipientType),
        timestamp: new Date().toISOString(),
        title: String(title),
        message: String(message),
      };

      await this.sendNotification(token, title, message, notificationData);
      console.log(`📱 FCM notification sent to ${recipientType} (${recipientId})`);
    } else {
      console.warn(`⚠️ No FCM token found for ${recipientType} (${recipientId})`);
    }

    await this.notificationRepo.create({

      recipientId,
      recipientType,
      title,
      message,
      createdAt: new Date(),
      read: false
    });

    return this.notificationRepo.getByRecipient(recipientId, recipientType);
  }

  async getByRecipient(
    recipientId: string,
    recipientType: "vendor" | "user"
  ): Promise<INotificationEntity[]> {
    return this.notificationRepo.getByRecipient(recipientId, recipientType);
  }
}
