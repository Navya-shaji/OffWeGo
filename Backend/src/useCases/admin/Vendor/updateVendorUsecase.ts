import { IVendorRepository } from "../../../domain/interface/vendor/IVendorRepository";

export class UpdateVendorUsecase {
  constructor(private _vendorRepository: IVendorRepository) {}

  async execute(vendorId: string, isBlocked: boolean): Promise<void> {
    const status = isBlocked ? "blocked" : "unblocked";
    await this._vendorRepository.updateVendorStatusByAdmin(vendorId, status);
  }
}
