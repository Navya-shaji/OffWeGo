import { IVendorRepository } from "../../../domain/interface/Vendor/IVendorRepository";
import { IAdminVendorApprovalUseCase } from "../../../domain/interface/Admin/IAdminVendorApprovalUsecase";
import { mapToVendor } from "../../../mappers/Vendor/vendorMapper";
import { IVendorModel } from "../../../framework/database/Models/vendorModel";
import { VendorDto } from "../../../domain/dto/Vendor/vendorDto";

export class AdminVendorApprovalUseCase implements IAdminVendorApprovalUseCase {
  constructor(private _vendorRepository: IVendorRepository) {}

  async getPending(): Promise<VendorDto[]> {
    const docs: IVendorModel[] = await this._vendorRepository.findPendingVendors();
    return docs.map(mapToVendor);
  }
  async updateStatus(id: string, status: 'approved' | 'rejected'): Promise<VendorDto | null> {
    const updatedDoc = await this._vendorRepository.updateVendorStatus(id, status);
    return updatedDoc ? mapToVendor(updatedDoc) : null;
  }

  async execute(): Promise<VendorDto[]> {
    return await this.getPending();
  }
}
