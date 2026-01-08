export interface ICompleteTripUseCase {
  execute(
    bookingId: string,
    vendorId: string,
    adminId: string,
  ): Promise<void>;
}
