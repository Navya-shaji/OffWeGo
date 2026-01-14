export interface IUpdateVendorUsecase {
  execute(vendorId: string, isBlocked: boolean): Promise<void>;
}
