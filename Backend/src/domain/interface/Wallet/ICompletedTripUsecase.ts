export interface ICompleteTripUseCase {
  execute(
    bookingId: string,
    vendorId: string,
    adminId: string,
    totalAmount: number
  ): Promise<void>;
}
