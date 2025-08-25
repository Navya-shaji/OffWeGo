import { IVendorRepository } from "../../../domain/interface/vendor/IVendorRepository";
import { IAdminVendorApprovalUseCase } from "../../../domain/interface/admin/IAdminVendorApprovalUsecase";
import { Vendor } from "../../../domain/entities/vendorEntities";
import { mapToVendor } from "../../../mappers/Vendor/vendorMapper";
import { IVendorModel } from "../../../framework/database/Models/vendorModel";

export class AdminVendorApprovalUseCase implements IAdminVendorApprovalUseCase {
  constructor(private _vendorRepository: IVendorRepository) {}

  async getPending(): Promise<Vendor[]> {
    const docs: IVendorModel[] = await this._vendorRepository.findPendingVendors();
    return docs.map(mapToVendor);
  }
  async updateStatus(id: string, status: 'approved' | 'rejected'): Promise<Vendor | null> {
    const updatedDoc = await this._vendorRepository.updateVendorStatus(id, status);
    return updatedDoc ? mapToVendor(updatedDoc as any) : null;
  }

  async execute(): Promise<Vendor[]> {
    return await this.getPending();
  }
}
