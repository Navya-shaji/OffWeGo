export interface ICompleteTripUseCase {
  execute(
    bookingId: string,
    driverId: string,
    adminId: string,
    totalAmount: number
  ): Promise<void>;
}
