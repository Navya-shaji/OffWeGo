import { IVendorModel } from "../../../framework/database/Models/vendorModel";

export interface IVendorProfileUseCase {
    execute(email: string): Promise<IVendorModel | null>
}