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
    console.log(vendorId,"id")
    packageData.hotels = (packageData.hotels || []).filter(Boolean);
    packageData.activities = (packageData.activities || []).filter(Boolean);

  const subscription = await this._subscriptionRepo.getLatestSubscriptionByVendor(vendorId);
  console.log(subscription,"sub")
  const maxPackagess = subscription?.maxPackages
if (subscription && subscription.planId) {
  console.log(maxPackagess, "sh");
}

  console.log(subscription,"sub")
let totalPackagesAllowed = 3;

if (subscription) {
  totalPackagesAllowed += subscription.maxPackages || 3;
}
console.log(totalPackagesAllowed,"total")
const existingPackages = await this._packageRepo.countPackagesByVendor(vendorId);

if (existingPackages >= totalPackagesAllowed) {
  throw new Error(`You have reached your limit of ${totalPackagesAllowed} packages. Upgrade your plan to add more.`);
}


    if (subscription) {
      const totalPackagesAllowed = subscription.maxPackages || 3;
      if (existingPackages >= totalPackagesAllowed) {
        throw new Error(`You have reached your subscription limit of ${totalPackagesAllowed} packages. Upgrade your plan to add more.`);
      }
    }

    const createdDoc = await this._packageRepo.createPackage(packageData);
    console.log(createdDoc, "created package");

    if (subscription && subscription.status === "active") {
      await this._subscriptionRepo.updateUsedPackages(
        subscription.id,
        (subscription.usedPackages || 0) + 1
      );
    }

    return mapToPackageDTO(createdDoc);
  }
}
