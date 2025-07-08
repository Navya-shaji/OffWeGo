import { Vendor } from "../../../domain/entities/vendorEntities";
import { IVendorRepository } from "../../../domain/interface/vendor/IVendorRepository";

export class UpdateVendorstatusUseCase {
  constructor(private vendorRepository: IVendorRepository) {}

 
  async execute(email: string, status: "approved" | "rejected"): Promise<Vendor | null> {
    const vendor = await this.vendorRepository.findByEmail(email);

    if (!vendor || !vendor._id) {
      return null;
    }

    const updatedVendor = await this.vendorRepository.updateVendorStatus(vendor._id, status);
    return updatedVendor;
  }


  async executeById(id: string, status: "approved" | "rejected"): Promise<Vendor | null> {
    const updatedVendor = await this.vendorRepository.updateVendorStatus(id, status);
    return updatedVendor;
  }
}
