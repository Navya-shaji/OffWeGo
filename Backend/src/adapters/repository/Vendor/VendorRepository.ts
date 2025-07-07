import { IVendorRepository } from "../../../domain/interface/vendor/IVendorRepository";
import { VendorModel } from "../../../framework/database/Models/vendorModel";
import { Vendor } from "../../../domain/entities/vendorEntities";

export class VendorRepository implements IVendorRepository {
  async createVendor(vendorData: Vendor): Promise<Vendor> {
    const vendor = new VendorModel(vendorData);
    const savedVendor = await vendor.save();
    return this.toVendorEntity(savedVendor);
  }

async findByEmail(email: string): Promise<Vendor | null> {
  const normalizedEmail = email.toLowerCase().trim();
  console.log("🔍 Searching for vendor:", normalizedEmail);

  const vendor = await VendorModel.findOne({ email: normalizedEmail });
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

  async updateVendorStatus(id: string, status: "approved" | "rejected"): Promise<Vendor | null> {
    const updatedVendor = await VendorModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    return updatedVendor ? this.toVendorEntity(updatedVendor) : null;
  }

  async updateVendorStatusByEmail(
    email: string,
    status: "approved" | "rejected"
  ): Promise<Vendor | null> {
    const updatedVendor = await VendorModel.findOneAndUpdate(
      { email },
      { $set: { status } },
      { new: true }
    );
    return updatedVendor ? this.toVendorEntity(updatedVendor) : null;
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

  async findByStatus(status: string): Promise<Vendor[]> {
    const vendors = await VendorModel.find({ status });
    return vendors.map(this.toVendorEntity);
  }
  // framework/database/mongodb/repositories/vendorRepository.ts

async getAllVendors(): Promise<Vendor[]> {
  return await VendorModel.find(); // Or apply sorting/filtering if needed
}


  private toVendorEntity = (doc: any): Vendor => ({
    _id: doc._id.toString(), // ✅ ensure this is included
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
    googleVerified: doc.googleVerified,
  });
}
