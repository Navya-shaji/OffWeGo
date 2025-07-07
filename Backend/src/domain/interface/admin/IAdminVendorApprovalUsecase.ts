import { Vendor } from "../../entities/vendorEntities";

export interface IAdminVendorApprovalUseCase {
  getPending(): Promise<Vendor[]>;
  updateStatus(id: string, status: 'approved' | 'rejected'): Promise<Vendor | null>;
}