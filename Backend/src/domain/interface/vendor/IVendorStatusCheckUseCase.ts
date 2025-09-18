import { Vendor } from "../../entities/VendorEntities";

export interface IVendorStatusCheckUseCase {
  execute(email: string): Promise<Vendor | null>;
}