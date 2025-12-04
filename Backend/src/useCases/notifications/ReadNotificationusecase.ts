import { INotificationRepository } from "../../domain/interface/Notification/INotificationRepo";
import { IReadNotificationusecase } from "../../domain/interface/Notification/IReadNotificationusecase";

export class ReadNotificationusecase implements IReadNotificationusecase {
  constructor(private _notificationRepo: INotificationRepository) {}

  async execute(id: string): Promise<boolean> {
    const Notification = await this._notificationRepo.findById(id);
    if (!Notification) throw new Error("Notification not found");
    Notification.read = true;
    const updatedNotification = await this._notificationRepo.update(
      id,
      Notification
    );
    return updatedNotification !== null;
  }
}
