
import { RegistervendorDto } from "../../../domain/dto/Vendor/RegisterVendorDto";
import { IVendorRepository } from "../../../domain/interface/vendor/IVendorRepository";
import { IVendorProfileUseCase } from "../../../domain/interface/vendor/IvendorProfileUsecase";

export class VendorProfileUsecase implements IVendorProfileUseCase{
    constructor(private vendorRepository:IVendorRepository){}

 async execute(email: string): Promise<RegistervendorDto | null> {
    const vendor = await this.vendorRepository.findByEmail(email);
    return vendor;
 }
}