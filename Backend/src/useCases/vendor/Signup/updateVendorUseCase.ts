// import { IVendorRepository } from "../../../domain/interface/vendor/IVendorRepository";
// import { Vendor } from "../../../domain/entities/vendorEntities";

// export class UpdateVendorstatusUseCase {
//   constructor(private vendorRepository: IVendorRepository) {}

//   async execute(email: string, status: "approved" | "rejected"): Promise<Vendor | null> {
//     const updatedVendor = await this.vendorRepository.updateVendorStatusByEmail(email, status);
//     return updatedVendor; 
//   }
// }
