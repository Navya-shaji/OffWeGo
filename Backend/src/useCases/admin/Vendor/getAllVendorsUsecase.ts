import { IVendorRepository } from "../../../domain/interface/vendor/IVendorRepository";
import { Vendor } from "../../../domain/entities/vendorEntities";
import { mapToVendor } from "../../../mappers/Vendor/vendorMapper";

export class GetAllVendorsUseCase {
  constructor(private _vendorRepository: IVendorRepository) {}

  async execute(page: number, limit: number): Promise<{ vendors: Vendor[]; totalvendors: number }> {
    const skip = (page - 1) * limit;

    const vendors = await this._vendorRepository.getAllVendors(skip, limit, { role: "Vendor" });
    const totalVendors = await this._vendorRepository.countVendors({ role: "Vendor" });

    return {
      vendors: vendors.map(mapToVendor),
      totalvendors: totalVendors,
    };
  }
}
