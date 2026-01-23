export interface IWalletPaymentUseCase {
  execute(
    userId: string,
    amount: number,
    description?: string,
    bookingId?: string 
  ): Promise<{
    success: boolean;
    message: string;
    newBalance?: number;
  }>;
}
