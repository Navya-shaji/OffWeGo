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
  ) {}

  private async sendNotification(
    token: string,
    title: string,
    body: string
  ): Promise<void> {
    await firebaseAdmin.messaging().send({
      token,
      notification: { title, body },
    });
  }

  async send(notification: NotificationDto): Promise<INotificationEntity[]> {
    const { recipientId, recipientType, title, message } = notification;

  
    let token: string | null = null;
    if (recipientType === "user") {
      token = await this.userRepo.getFcmTokenById(recipientId);
    } else {
      token = await this.vendorRepo.getFcmTokenById(recipientId);
    }

    if (token) {
      await this.sendNotification(token, title, message);
    }

    await this.notificationRepo.create({
    
      recipientId,
      recipientType,
      title,
      message,
      createdAt: new Date(),
      read:false
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
