import { Vendor } from "../../domain/entities/VendorEntities";
import { IVendorModel } from "../../framework/database/Models/vendorModel";

export const mapToVendor = (doc: IVendorModel): Vendor => ({
  _id: doc._id.toString(),
  name: doc.name,
  email: doc.email,
  phone: doc.phone,
  password: doc.password,
  documentUrl: doc.documentUrl,
  profileImage: doc.profileImage,
  status: doc.status,
  role: doc.role,
  isBlocked: doc.isBlocked,
  createdAt: doc.createdAt,
  lastLogin: doc.lastLogin,
  googleVerified: doc.googleVerified,
  isAdmin: doc.isAdmin,
  fcmToken:doc.fcmToken,


  subscription: doc.subscription
    ? {
        plan: doc.subscription.plan,
        subscribedAt: doc.subscription.subscribedAt,
        expiresAt: doc.subscription.expiresAt,
        maxPackages: doc.subscription.maxPackages,
      }
    : undefined,


  packageLimit: doc.packageLimit,
  currentPackages: doc.currentPackages,
});
