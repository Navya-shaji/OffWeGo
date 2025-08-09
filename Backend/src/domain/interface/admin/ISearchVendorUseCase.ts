import { Vendor } from "../../entities/vendorEntities";

export interface ISearchVendorUSecase{
    execute(query:string):Promise<Vendor[]>
}