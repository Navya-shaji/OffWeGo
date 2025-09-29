import { Vendor } from "../../entities/VendorEntities";

export interface IVendorProfileEditUsecase{
    execute(id:string,updatedData:Vendor):Promise<Vendor|null>
}