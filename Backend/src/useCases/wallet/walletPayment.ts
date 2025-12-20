import { IWalletPaymentUseCase } from "../../domain/interface/Wallet/IWalletPayment"; 
import { IWalletRepository } from "../../domain/interface/Wallet/IWalletRepository";

export class WalletPaymentUseCase implements IWalletPaymentUseCase {
  private walletRepository: IWalletRepository;

  constructor(walletRepository: IWalletRepository) {
    this.walletRepository = walletRepository;
  }

  async execute(
    userId: string,
    amount: number,
    description: string = "Wallet Payment"
  ) {
    const wallet = await this.walletRepository.findByOwnerId(userId);
    if (!wallet) {
      throw new Error("Wallet not found");
    }

    if (wallet.balance < amount) {
      throw new Error("Insufficient wallet balance");
    }

    const updatedWallet = await this.walletRepository.updateBalance(
      userId,
      "user",
      amount,
      "debit",
      description
    );

    return {
      success: true,
      message: "Payment deducted successfully",
      newBalance: updatedWallet.balance,
    };
  }
}
