import { Vendor } from "../../entities/vendorEntities";
export interface IGetVendorByEmailUseCase {
  execute(email: string): Promise<Vendor | null>;
}
