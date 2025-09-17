

import { IVendorRepository } from "../../../domain/interface/Vendor/IVendorRepository";
import { Vendor } from "../../../domain/entities/VendorEntities";
import { IVendorStatusCheckUseCase } from "../../../domain/interface/Vendor/IVendorStatusCheckUseCase";
import { mapToVendor } from "../../../mappers/Vendor/vendorMapper";

export class VendorStatusCheckUseCase implements IVendorStatusCheckUseCase {
  constructor(private _vendorRepository: IVendorRepository) {}

  async execute(email: string): Promise<Vendor | null> {
    const vendor=await this._vendorRepository.findByEmail(email.trim().toLowerCase())
    if(!vendor) return null

    return mapToVendor(vendor)
  }
}
