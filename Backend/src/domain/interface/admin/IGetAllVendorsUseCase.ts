import { Vendor } from "../../entities/vendorEntities";

export interface IGetAllVendorsUseCase{
    execute():Promise<Vendor[]|null>
}