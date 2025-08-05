import { RegistervendorDto } from "../../../domain/dto/Vendor/RegisterVendorDto";
import { IVendorRepository } from "../../../domain/interface/vendor/IVendorRepository";
import { VendorModel } from "../../../framework/database/Models/vendorModel";
import { IVendorModel } from "../../../framework/database/Models/vendorModel"; 

export class VendorRepository implements IVendorRepository {
   async createVendor(data: RegistervendorDto): Promise<IVendorModel> {
    const vendor = new VendorModel(data);
    return await vendor.save(); 
  }

  async findByEmail(email: string): Promise<IVendorModel | null> {
    return await VendorModel.findOne({
      email: { $regex: new RegExp(`^${email.trim()}$`, "i") },
    });
  }

  async findByPhone(phone: string): Promise<IVendorModel | null> {
    return await VendorModel.findOne({ phone });  
  }

  async findById(id: string): Promise<IVendorModel | null> {
    return await VendorModel.findById(id);
  }

  async updateVendorStatus(id: string, status: "approved" | "rejected"): Promise<IVendorModel | null> {
    return await VendorModel.findByIdAndUpdate(id, { status }, { new: true });
  }

  async updateVendorStatusByEmail(email: string, status: "approved" | "rejected"): Promise<IVendorModel | null> {
    return await VendorModel.findOneAndUpdate({ email }, { $set: { status } }, { new: true });
  }

  async findPendingVendors(): Promise<IVendorModel[]> {
    return await VendorModel.find({ status: "pending" });
  }

  async approveVendor(id: string): Promise<IVendorModel | null> {
    return await VendorModel.findByIdAndUpdate(id, { status: "approved" }, { new: true });
  }

  async rejectVendor(id: string): Promise<IVendorModel | null> {
    return await VendorModel.findByIdAndUpdate(id, { status: "rejected" }, { new: true });
  }

  async updateLastLogin(id: string, date: Date): Promise<void> {
    await VendorModel.findByIdAndUpdate(id, { lastLogin: date });
  }

  async findByStatus(status: string): Promise<IVendorModel[]> {
    return await VendorModel.find({ status });
  }

  async getAllVendors(skip: number, limit: number, filter: Record<string, any> = {}): Promise<IVendorModel[]> {
    return await VendorModel.find(filter).skip(skip).limit(limit);
  }

  async updateVendorStatusByAdmin(
    vendorId: string,
    status: "blocked" | "unblocked"
  ): Promise<void> {
    const vendor = await VendorModel.findById(vendorId);
    if (!vendor) {
      throw new Error("Vendor not found");
    }

    vendor.isBlocked = status === "blocked";
    await vendor.save();
  }
    async getProfileByEmail(email:string): Promise<RegistervendorDto | null>{
      return await VendorModel.findOne({email})
    }
    async countVendors(filter:Record<string,any>={}):Promise<number>{
      return await VendorModel.countDocuments(filter)
    }
}
