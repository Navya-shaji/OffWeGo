import { PackageDTO } from "../../domain/dto/Package/PackageDto";
import { Package } from "../../domain/entities/PackageEntity";
import { ICreatePackage } from "../../domain/interface/Vendor/IAddPackageUsecase";
import { IPackageRepository } from "../../domain/interface/Vendor/iPackageRepository";
import { ISubscriptionBookingRepository } from "../../domain/interface/SubscriptionPlan/ISubscriptionBookingRepo";
import { mapToPackageDTO } from "../../mappers/Packages/mapTopackages";

export class CreatePackagesUseCase implements ICreatePackage {
  constructor(
    private _packageRepo: IPackageRepository,
    private _subscriptionRepo: ISubscriptionBookingRepository
  ) { }

  async execute(data: Package, vendorId: string): Promise<PackageDTO> {
    const packageData: Package = { ...data, vendorId };
    packageData.hotels = (packageData.hotels || []).filter(Boolean);
    packageData.activities = (packageData.activities || []).filter(Boolean);
    await this._subscriptionRepo.expireOldSubscriptions(vendorId);
    const subscription =
      await this._subscriptionRepo.getLatestSubscriptionByVendor(vendorId);

    if (!subscription) {
      throw new Error(
        "You do not have an active subscription. Please purchase a subscription plan to add packages."
      );
    }

    if (subscription.status !== "active") {
      throw new Error(
        `Your subscription is ${subscription.status}. Please activate or renew your subscription plan to add packages.`
      );
    }

    const now = new Date();
    if (subscription.endDate) {
      const endDate = new Date(subscription.endDate);
      if (endDate < now) {
        throw new Error(
          "Your subscription has expired. Please renew your subscription plan to continue adding packages."
        );
      }
    }
    const createdDoc = await this._packageRepo.createPackage(packageData);

    return mapToPackageDTO(createdDoc);
  }
}
