import { VendorDto } from "../../../domain/dto/Vendor/VendorDto";
import { IVendorRepository } from "../../../domain/interface/Vendor/IVendorRepository";
import { IWalletRepository } from "../../../domain/interface/Wallet/IWalletRepository";
import { mapToVendor } from "../../../mappers/Vendor/vendorMapper";
import { Role } from "../../../domain/constants/Roles";

export class UpdateVendorstatusUseCase {
  constructor(
    private _vendorRepository: IVendorRepository,
    private _walletRepository: IWalletRepository
  ) { }

  async execute(
    email: string,
    status: "approved" | "rejected",
    rejectionReason?: string
  ): Promise<VendorDto | null> {
    const vendorDoc = await this._vendorRepository.findByEmail(email);

    if (!vendorDoc || !vendorDoc._id) {
      return null;
    }

    const updatedDoc = await this._vendorRepository.updateVendorStatus(
      vendorDoc._id.toString(),
      status,
      rejectionReason
    );

    if (updatedDoc && status === "approved") {
      const existingWallet = await this._walletRepository.findByOwnerId(
        updatedDoc._id.toString()
      );
      if (!existingWallet) {
        await this._walletRepository.createWallet({
          ownerId: updatedDoc._id.toString(),
          ownerType: Role.VENDOR,
          balance: 0,
          transactions: [],
        });
      }
    }

    return updatedDoc ? mapToVendor(updatedDoc) : null;
  }

  async executeById(
    id: string,
    status: "approved" | "rejected",
    rejectionReason?: string
  ): Promise<VendorDto | null> {
    const updatedDoc = await this._vendorRepository.updateVendorStatus(
      id,
      status,
      rejectionReason
    );

    if (updatedDoc && status === "approved") {
      const existingWallet = await this._walletRepository.findByOwnerId(id);
      if (!existingWallet) {
        await this._walletRepository.createWallet({
          ownerId: id,
          ownerType: Role.VENDOR,
          balance: 0,
          transactions: [],
        });
      }
    }

    return updatedDoc ? mapToVendor(updatedDoc) : null;
  }
}