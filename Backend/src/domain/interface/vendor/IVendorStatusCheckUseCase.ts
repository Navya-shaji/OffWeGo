import { Vendor } from "../../entities/vendorEntities";

export interface IVendorStatusCheckUseCase {
  execute(email: string): Promise<Vendor | null>;
}