

import { IVendorRepository } from "../../../domain/interface/vendor/IVendorRepository";
import { Vendor } from "../../../domain/entities/vendorEntities";
import { IVendorStatusCheckUseCase } from "../../../domain/interface/vendor/IVendorStatusCheckUseCase";
import { mapToVendor } from "../../../mappers/Vendor/vendorMapper";

export class VendorStatusCheckUseCase implements IVendorStatusCheckUseCase {
  constructor(private vendorRepository: IVendorRepository) {}

  async execute(email: string): Promise<Vendor | null> {
    const vendor=await this.vendorRepository.findByEmail(email.trim().toLowerCase())
    if(!vendor) return null

    return mapToVendor(vendor)
  }
}
