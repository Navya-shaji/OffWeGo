import { Vendor } from "../../entities/VendorEntities";

export interface ISearchVendorUSecase{
    execute(query:string):Promise<Vendor[]>
}