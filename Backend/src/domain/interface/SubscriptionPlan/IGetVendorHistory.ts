export interface IGetVendorSubscriptionHistoryUseCase {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  execute(vendorId: string, search?: string, status?: string, skip?: number, limit?: number): Promise<{ bookings: any[]; total: number }>;
}
