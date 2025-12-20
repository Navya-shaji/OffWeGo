export interface IWalletPaymentUseCase {
  execute(
    userId: string,
    amount: number,
    description?: string,
    bookingId?: string // ✅ optional bookingId
  ): Promise<{
    success: boolean;
    message: string;
    newBalance?: number;
  }>;
}
