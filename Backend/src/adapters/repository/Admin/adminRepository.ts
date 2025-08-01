import { IAdminRepository } from "../../../domain/interface/admin/IAdminRepository";
import { User } from "../../../domain/entities/userEntity";
import { Vendor } from "../../../domain/entities/vendorEntities";
import { UserModel } from "../../../framework/database/Models/userModel";
import { VendorModel } from "../../../framework/database/Models/vendorModel";

export class AdminRepository implements IAdminRepository {
  async findByEmail(email: string): Promise<User | null> {
    return await UserModel.findOne({ email: email.toLowerCase().trim() });
  }

  async findVendorByEmail(email: string): Promise<Vendor | null> {
    return await VendorModel.findOne({ email: email.toLowerCase().trim() });
  }
}
