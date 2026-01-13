import { Vendor } from "../../entities/VendorEntities";

export interface IUpdateVendorStatusUseCase {
  execute(
    email: string,
    status: "approved" | "rejected",
    rejectionReason?: string
  ): Promise<Vendor | null>;
  executeById(
    id: string,
    status: "approved" | "rejected",
    rejectionReason?: string
  ): Promise<Vendor | null>;
}
