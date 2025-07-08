// useCases/vendor/Status/VendorStatusCheckUseCase.ts

import { IVendorRepository } from "../../../domain/interface/vendor/IVendorRepository";
import { Vendor } from "../../../domain/entities/vendorEntities";
import { IVendorStatusCheckUseCase } from "../../../domain/interface/vendor/IVendorStatusCheckUseCase";

export class VendorStatusCheckUseCase implements IVendorStatusCheckUseCase {
  constructor(private vendorRepository: IVendorRepository) {}

  async execute(email: string): Promise<Vendor | null> {
    return await this.vendorRepository.findByEmail(email);
  }
}
