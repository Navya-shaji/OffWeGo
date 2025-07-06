import { Vendor } from "../../entities/vendorEntities";
import { IVendorRepository } from "./IVendorRepository";

export class GetPendingVendorsUsecase{
    constructor(private vendoreRepository:IVendorRepository){}

    async execute():Promise<Vendor[]>{
        return await this.vendoreRepository.findByStatus("otp_verified")
    }
}