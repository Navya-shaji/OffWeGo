import { IVendorModel } from "../../../framework/database/Models/vendorModel";
import { RegistervendorDto } from "../../dto/Vendor/RegisterVendorDto";
import { Vendor } from "../../entities/VendorEntities";

export interface IVendorRepository {
  createVendor(data: RegistervendorDto): Promise<IVendorModel>;
  findByEmail(email: string): Promise<IVendorModel | null>;
  findByPhone(phone: string): Promise<IVendorModel | null>;
  updateVendorStatus(
    id: string,
    status: "approved" | "rejected",
    rejectionReason?: string
  ): Promise<IVendorModel | null>;
  updateVendorStatusByEmail(
    email: string,
    status: "approved" | "rejected",
    rejectionReason?: string
  ): Promise<IVendorModel | null>;
  findByStatus(status: string): Promise<IVendorModel[]>;
  findById(id: string): Promise<IVendorModel | null>;
  findPendingVendors(): Promise<IVendorModel[]>;
  approveVendor(id: string): Promise<IVendorModel | null>;
  rejectVendor(id: string, rejectionReason?: string): Promise<IVendorModel | null>;
  getAllVendors(
    skip: number,
    limit: number,
    filter?: Record<string, unknown>
  ): Promise<IVendorModel[]>;
  updateVendorStatusByAdmin(
    vendorId: string,
    status: "blocked" | "unblocked"
  ): Promise<void>;
  getProfileByEmail(email: string): Promise<RegistervendorDto | null>;
  countVendors(filter?: Record<string, unknown>): Promise<number>;
  searchVendor(query: string): Promise<Vendor[]>;
  updateFcmToken(id: string, token: string): Promise<IVendorModel | null>;
  getFcmTokenById(vendorId: string): Promise<string | null>;
  findAll(): Promise<IVendorModel[]>;
  update(id: string, data: Partial<IVendorModel>): Promise<IVendorModel | null>;
}
