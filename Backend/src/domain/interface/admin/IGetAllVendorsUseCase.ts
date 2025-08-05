import { Vendor } from "../../entities/vendorEntities";

export interface IGetAllVendorsUseCase{
    execute( page: number,
    limit: number):Promise<{vendors:Vendor[],totalvendors: number}>
}