import { Vendor } from "../../../domain/entities/vendorEntities";
import { IVendorRepository } from "../../../domain/interface/vendor/IVendorRepository";

export class GetVendorByEmailUseCase {
  constructor(private vendorRepository: IVendorRepository) {}

  async execute(email: string): Promise<Vendor | null> {
    return await this.vendorRepository.findByEmail(email.toLowerCase().trim());
  }
}
