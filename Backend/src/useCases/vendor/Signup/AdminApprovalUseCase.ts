import { IVendorRepository } from "../../../domain/interface/vendor/IVendorRepository";
import { IAdminVendorApprovalUseCase } from "../../../domain/interface/admin/IAdminVendorApprovalUsecase";
import { Vendor } from "../../../domain/entities/vendorEntities";


export class AdminVendorApprovalUseCase implements IAdminVendorApprovalUseCase {
  constructor(private vendorRepository: IVendorRepository) {}

  async getPending(): Promise<Vendor[]> {
   return await this.vendorRepository.findPendingVendors()
  }

  async updateStatus(id: string, status: 'approved' | 'rejected'): Promise<Vendor | null> {
    return await this.vendorRepository.updateVendorStatus(id, status);
  }
}