import { Vendor } from "../../entities/VendorEntities"
export interface IGetVendorByEmailUseCase{
    execute(email:string):Promise<Vendor| null>
}
