import { mapToVendor } from "../../../mappers/Vendor/vendorMapper";
import { Vendor } from "../../entities/vendorEntities";
import { IVendorRepository } from "./IVendorRepository";

export class GetPendingVendorsUsecase {
    constructor(private vendoreRepository: IVendorRepository) {}

    async execute(): Promise<Vendor[]> {
        const result = await this.vendoreRepository.findByStatus("otp_verified");
        return result.map(doc => mapToVendor(doc));  
    }
}
