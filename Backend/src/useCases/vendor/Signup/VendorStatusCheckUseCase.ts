

import { IVendorRepository } from "../../../domain/interface/Vendor/IVendorRepository";
import { IVendorStatusCheckUseCase } from "../../../domain/interface/Vendor/IVendorStatusCheckUseCase";
import { mapToVendor } from "../../../mappers/Vendor/vendorMapper";
import { VendorDto } from "../../../domain/dto/Vendor/vendorDto";

export class VendorStatusCheckUseCase implements IVendorStatusCheckUseCase {
  constructor(private _vendorRepository: IVendorRepository) {}

  async execute(email: string): Promise<VendorDto | null> {
    const vendor=await this._vendorRepository.findByEmail(email.trim().toLowerCase())
    if(!vendor) return null

    return mapToVendor(vendor)
  }
}
