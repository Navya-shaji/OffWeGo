import { User } from "../../entities/userEntity";
import { Vendor } from "../../entities/vendorEntities";
export interface IAdminRepository{
      findByEmail(email: string): Promise<User | null>;
      findVendorByEmail(email:string):Promise<Vendor|null>;
}