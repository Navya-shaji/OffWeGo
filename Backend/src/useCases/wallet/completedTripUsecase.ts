import { ICompleteTripUseCase } from "../../domain/interface/Wallet/ICompletedTripUsecase";
import { IWalletRepository } from "../../domain/interface/Wallet/IWalletRepository";

export class CompleteTripUseCase implements ICompleteTripUseCase {
  constructor(
    private walletRepository: IWalletRepository
  ) {}

  async execute(
    bookingId: string,
    vendorId: string,
    adminId: string,
    totalAmount: number
  ): Promise<void> {
console.log(adminId,bookingId)
    const existingTransaction =
      await this.walletRepository.getTransactionByRef(adminId, bookingId);
console.log(existingTransaction,"Ex")
    if (!existingTransaction) {
      throw new Error("Trip transaction not found in admin wallet");
    }

    if (existingTransaction.status === "completed") {
      throw new Error("Trip already settled");
    }

    const VendorAmount = totalAmount * 0.9;      
    const adminCommission = totalAmount * 0.1;    

    await this.walletRepository.updateBalance(
      vendorId,
      "vendor",
      VendorAmount,
      "credit",
      "Trip completed earning",
      bookingId
    );

    await this.walletRepository.updateTransactionStatus(
      adminId,
      bookingId,
      "completed"
    );

    await this.walletRepository.updateBalance(
      adminId,
      "admin",
      adminCommission,
      "credit",
      "Admin commission for trip",
      bookingId
    );
  }
}
