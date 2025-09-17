import { Vendor } from "../../../domain/entities/vendorEntities";
import { IVendorRepository } from "../../../domain/interface/vendor/IVendorRepository";
import { mapToVendor } from "../../../mappers/Vendor/vendorMapper";
export class GetVendorByEmailUseCase {
  constructor(private _vendorRepository: IVendorRepository) {}

  async execute(email: string): Promise<Vendor | null> {
    const vendorDoc = await this._vendorRepository.findByEmail(email.toLowerCase().trim());

    return vendorDoc ? mapToVendor(vendorDoc) : null;
  }
}
