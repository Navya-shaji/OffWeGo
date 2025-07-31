import { IVendorRepository } from "../../../domain/interface/vendor/IVendorRepository";
import { Vendor } from "../../../domain/entities/vendorEntities";
import { mapToVendor } from "../../../mappers/Vendor/vendorMapper";

export class GetAllVendorsUseCase {
  constructor(private vendorRepository: IVendorRepository) {}

  async execute(): Promise<Vendor[]> {
    const vendors = await this.vendorRepository.getAllVendors();
    return vendors.map(mapToVendor);
  }
}
