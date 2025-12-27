export interface IGetVendorSubscriptionHistoryUseCase {
  execute(vendorId: string): Promise<any[]>;
}
