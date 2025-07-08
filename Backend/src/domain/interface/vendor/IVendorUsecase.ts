import { RegistervendorDto } from "../../dto/Vendor/RegisterVendorDto"; 
import { Vendor } from "../../entities/vendorEntities";

export interface IRegisterVendorUseCase {
  execute(vendorInput: RegistervendorDto): Promise<Vendor>;
}