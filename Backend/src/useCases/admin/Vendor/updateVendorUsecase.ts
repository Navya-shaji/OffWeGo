import { IVendorRepository } from "../../../domain/interface/Vendor/IVendorRepository";
import { NotificationDto } from "../../../domain/dto/Notification/NotificationDto";
import { INotificationService } from "../../../domain/interface/Notification/ISendNotification";
import { Role } from "../../../domain/constants/Roles";

export class UpdateVendorUsecase {
  constructor(
    private _vendorRepository: IVendorRepository,
    private _notificationService: INotificationService
  ) {}

  async execute(vendorId: string, isBlocked: boolean): Promise<void> {
    const status = isBlocked ? "blocked" : "unblocked";

    await this._vendorRepository.updateVendorStatusByAdmin(vendorId, status);

    const vendor = await this._vendorRepository.findById(vendorId);
    if (!vendor) throw new Error("Vendor not found");

    const notification: NotificationDto = {
      recipientId: vendorId,
      recipientType: Role.VENDOR,
      title: isBlocked ? "Account Blocked" : "Account Unblocked",
      message: isBlocked
        ? "Your vendor account has been blocked by the admin. Please contact support for assistance."
        : "Your vendor account has been unblocked. You can now access the full platform functionality.",
      createdAt: new Date(),
      read:false
    };


    await this._notificationService.send(notification);
  }
}
