import { RegistervendorDto } from "../../dto/Vendor/RegisterVendorDto"; 
import { Vendor } from "../../entities/VendorEntities";

export interface IRegisterVendorUseCase {
  execute(vendorInput: RegistervendorDto): Promise<Vendor>;
}