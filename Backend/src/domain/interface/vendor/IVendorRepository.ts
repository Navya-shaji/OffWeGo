import { Vendor } from "../../entities/vendorEntities";

export interface IVendorRepository {
  createVendor(Vendor: Vendor): Promise<Vendor>;
  findByEmail(email: string): Promise<Vendor | null>;
  findByPhone(phone: string): Promise<Vendor | null>;
  updateVendorStatus(
    id: string,
    status: "approved" | "rejected"
  ): Promise<Vendor | null>;
  updateVendorStatusByEmail(
    email: string,
    status: "approved" | "rejected"
  ): Promise<Vendor | null>;
  findByStatus(status: string): Promise<Vendor[]>;
  findById(id: string): Promise<Vendor | null>;
  findPendingVendors(): Promise<Vendor[]>;
  approveVendor(id: string): Promise<Vendor | null>;
  rejectVendor(id: string): Promise<Vendor | null>;

  getAllVendors(): Promise<Vendor[]>;
  updateVendorStatusByAdmin(
    vendorId: string,
    status: "blocked" | "unblocked"
  ): Promise<void>;
}
