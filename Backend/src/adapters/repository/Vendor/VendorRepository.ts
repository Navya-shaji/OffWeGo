import { IVendorRepository } from "../../../domain/interface/vendor/IVendorRepository"; 
import { VendorModel } from "../../../framework/database/Models/vendorModel"; 
import { Vendor } from "../../../domain/entities/vendorEntities";


export class VendorRepository implements IVendorRepository {
  async createVendor(vendorData: Vendor): Promise<Vendor> {
    const vendor = new VendorModel(vendorData);
    const savedVendor = await vendor.save();
    return savedVendor.toObject() as Vendor;
  }
  async findByEmail(email: string): Promise<Vendor | null> {
    const vendor = await VendorModel.findOne({ email });
    return vendor ? this.toVendorEntity(vendor) : null;
  }

  async findByPhone(phone: string): Promise<Vendor | null> {
    const vendor = await VendorModel.findOne({ phone });
    return vendor ? this.toVendorEntity(vendor) : null;
  }

  async findById(id: string): Promise<Vendor | null> {
    const vendor = await VendorModel.findById(id);
    return vendor ? this.toVendorEntity(vendor) : null;
  }

  async findPendingVendors(): Promise<Vendor[]> {
    const vendors = await VendorModel.find({ status: "pending" });
    return vendors.map(this.toVendorEntity);
  }

  async approveVendor(id: string): Promise<Vendor | null> {
    const updated = await VendorModel.findByIdAndUpdate(
      id,
      { status: "approved" },
      { new: true }
    );
    return updated ? this.toVendorEntity(updated) : null;
  }

  async rejectVendor(id: string): Promise<Vendor | null> {
    const updated = await VendorModel.findByIdAndUpdate(
      id,
      { status: "rejected" },
      { new: true }
    );
    return updated ? this.toVendorEntity(updated) : null;
  }

  async updateLastLogin(id: string, date: Date): Promise<void> {
    await VendorModel.findByIdAndUpdate(id, { lastLogin: date });
  }

  private toVendorEntity = (doc: any): Vendor => ({
    
    name: doc.name,
    email: doc.email,
    phone: doc.phone,
    password: doc.password,
    profileImage: doc.profileImage,
    createdAt: doc.createdAt,
    documentUrl: doc.documentUrl,
    status: doc.status,
    role: doc.role,
    lastLogin: doc.lastLogin,
    isAdmin: doc.isAdmin,
    googleVerified: doc.googleVerified
  });
}
