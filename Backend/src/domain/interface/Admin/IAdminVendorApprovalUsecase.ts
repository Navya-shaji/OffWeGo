import { Vendor } from "../../entities/VendorEntities";

export interface IAdminVendorApprovalUseCase {
  execute(): Promise<Vendor[]>;
  getPending(): Promise<Vendor[]>;
  updateStatus(
    id: string,
    status: "approved" | "rejected"
  ): Promise<Vendor | null>;
}
