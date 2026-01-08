import { User } from "../../entities/UserEntity";
import { Vendor } from "../../entities/VendorEntities";

export interface IAdminRepository {
  findByEmail(email: string): Promise<User | null>;
  findVendorByEmail(email: string): Promise<Vendor | null>;
}
