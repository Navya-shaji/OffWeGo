import { Vendor } from "../../entities/vendorEntities";

export interface IVendorProfileEditUsecase{
    execute(id:string,updatedData:Vendor):Promise<Vendor|null>
}