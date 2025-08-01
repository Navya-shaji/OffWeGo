import { IVendorModel } from "../../../framework/database/Models/vendorModel";
import { RegistervendorDto } from "../../dto/Vendor/RegisterVendorDto";

export interface IVendorRepository {
  createVendor(data: RegistervendorDto): Promise<IVendorModel>;
  findByEmail(email: string): Promise<IVendorModel | null>;
  findByPhone(phone: string): Promise<IVendorModel | null>;
  updateVendorStatus(id: string, status: "approved" | "rejected"): Promise<IVendorModel | null>;
  updateVendorStatusByEmail(email: string, status: "approved" | "rejected"): Promise<IVendorModel | null>;
  findByStatus(status: string): Promise<IVendorModel[]>;
  findById(id: string): Promise<IVendorModel | null>;
  findPendingVendors(): Promise<IVendorModel[]>;
  approveVendor(id: string): Promise<IVendorModel | null>;
  rejectVendor(id: string): Promise<IVendorModel | null>;
  getAllVendors(): Promise<IVendorModel[]>;
  updateVendorStatusByAdmin(vendorId: string, status: "blocked" | "unblocked"): Promise<void>;
  getProfileByEmail(email:string): Promise<RegistervendorDto | null>;
}
