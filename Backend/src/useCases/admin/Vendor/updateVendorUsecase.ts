import { IVendorRepository } from "../../../domain/interface/vendor/IVendorRepository";

export class UpdateVendorUsecase {
  constructor(private vendorRepository: IVendorRepository) {}

  async execute(vendorId: string, isBlocked: boolean): Promise<void> {
    const status = isBlocked ? "blocked" : "unblocked";
    await this.vendorRepository.updateVendorStatusByAdmin(vendorId, status);
  }
}
