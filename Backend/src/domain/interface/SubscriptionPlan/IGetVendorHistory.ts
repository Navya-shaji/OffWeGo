export interface IGetVendorSubscriptionHistoryUseCase {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  execute(vendorId: string): Promise<any[]>;
}
