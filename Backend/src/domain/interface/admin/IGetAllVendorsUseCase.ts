import { Vendor } from "../../entities/VendorEntities";

export interface IGetAllVendorsUseCase{
    execute( page: number,
    limit: number):Promise<{vendors:Vendor[],totalvendors: number}>
}