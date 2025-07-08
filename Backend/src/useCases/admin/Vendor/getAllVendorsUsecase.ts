
import { IVendorRepository } from "../../../domain/interface/vendor/IVendorRepository";
import { Vendor } from "../../../domain/entities/vendorEntities";

export class GetAllVendorsUseCase {
  constructor(private vendorRepository: IVendorRepository) {}

  async execute(): Promise<Vendor[]> {
    return await this.vendorRepository.getAllVendors();
  }
}