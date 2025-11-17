export interface ITransferAmountUseCase {
  execute(adminId: string, vendorId: string, totalAmount: number): Promise<void>;
}
