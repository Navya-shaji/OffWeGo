import { ITransferAmountUseCase } from "../../domain/interface/Wallet/ITransferWalletAmountUsecase";
import { IWalletRepository } from "../../domain/interface/Wallet/IWalletRepository";


export class TransferAmountUseCase implements ITransferAmountUseCase {
  constructor(private walletRepository: IWalletRepository) {}

  async execute(adminId: string, vendorId: string, amount: number, refId?: string): Promise<void> {

    const vendorShare = amount * 0.9;

    await this.walletRepository.updateBalance(
      adminId,
      "admin",
      vendorShare,
      "debit",
      `Transferred 90% (${vendorShare}) to vendor ${vendorId}`,
      refId
    );

    await this.walletRepository.updateBalance(
      vendorId,
      "vendor",
      vendorShare,
      "credit",
      `Received 90% (${vendorShare}) from admin ${adminId}`,
      refId
    );
  }
}
