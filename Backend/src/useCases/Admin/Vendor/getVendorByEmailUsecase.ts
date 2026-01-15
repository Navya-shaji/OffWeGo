import { VendorDto } from "../../../domain/dto/Vendor/VendorDto";
import { IVendorRepository } from "../../../domain/interface/Vendor/IVendorRepository";
import { mapToVendor } from "../../../mappers/Vendor/vendorMapper";
export class GetVendorByEmailUseCase {
  constructor(private _vendorRepository: IVendorRepository) {}

  async execute(email: string): Promise<VendorDto | null> {
    const vendorDoc = await this._vendorRepository.findByEmail(email.toLowerCase().trim());

    return vendorDoc ? mapToVendor(vendorDoc) : null;
  }
}
