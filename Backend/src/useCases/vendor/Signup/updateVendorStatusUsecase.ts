import { Vendor } from "../../../domain/entities/vendorEntities";
import { IVendorRepository } from "../../../domain/interface/vendor/IVendorRepository";
import { mapToVendor } from "../../../mappers/Vendor/vendorMapper";

export class UpdateVendorstatusUseCase {
  constructor(private _vendorRepository: IVendorRepository) {}

  async execute(email: string, status: "approved" | "rejected"): Promise<Vendor | null> {
    const vendorDoc = await this._vendorRepository.findByEmail(email);

    if (!vendorDoc || !vendorDoc._id) {
      return null;
    }

    const updatedDoc = await this._vendorRepository.updateVendorStatus(vendorDoc._id.toString(), status);

    return updatedDoc ? mapToVendor(updatedDoc) : null;
  }

  async executeById(id: string, status: "approved" | "rejected"): Promise<Vendor | null> {
    const updatedDoc = await this._vendorRepository.updateVendorStatus(id, status);

    return updatedDoc ? mapToVendor(updatedDoc) : null;
  }
}