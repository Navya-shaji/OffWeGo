import { PackageDTO } from "../../domain/dto/package/PackageDto";
import { Package } from "../../domain/entities/PackageEntity";
import { ICreatePackage } from "../../domain/interface/Vendor/IAddPackageUsecase";
import { IPackageRepository } from "../../domain/interface/Vendor/iPackageRepository";
import { ISubscriptionBookingRepository } from "../../domain/interface/SubscriptionPlan/ISubscriptionBookingRepo";
import { mapToPackageDTO } from "../../mappers/Packages/mapTopackages";

export class CreatePackagesUseCase implements ICreatePackage {
  constructor(
    private _packageRepo: IPackageRepository,
    private _subscriptionRepo: ISubscriptionBookingRepository
  ) {}

  async execute(data: Package, vendorId: string): Promise<PackageDTO> {
    const packageData: Package = { ...data, vendorId };


    packageData.hotels = (packageData.hotels || []).filter(Boolean);
    packageData.activities = (packageData.activities || []).filter(Boolean);


    await this._subscriptionRepo.expireOldSubscriptions(vendorId);

  
    const subscription = await this._subscriptionRepo.getLatestSubscriptionByVendor(vendorId);
    console.log(subscription, "Latest Active Subscription");

   
    if (!subscription) {
      throw new Error(
        "You do not have an active subscription. Purchase a plan to add packages."
      );
    }

    if (subscription.status !== "active") {
      throw new Error("Your subscription is not active. Please renew your plan.");
    }

    const now = new Date();
    if (subscription.endDate && new Date(subscription.endDate) < now) {
      throw new Error(
        "Your subscription has expired. Renew your plan to continue adding packages."
      );
    }

  
    const createdDoc = await this._packageRepo.createPackage(packageData);
    console.log(createdDoc, "Created package");

    return mapToPackageDTO(createdDoc);
  }
}
