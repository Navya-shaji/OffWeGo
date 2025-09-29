
import { RegistervendorDto } from "../../../domain/dto/Vendor/RegisterVendorDto";
import { IVendorRepository } from "../../../domain/interface/Vendor/IVendorRepository";
import { IVendorProfileUseCase } from "../../../domain/interface/Vendor/IvendorProfileUsecase";

export class VendorProfileUsecase implements IVendorProfileUseCase{
    constructor(private _vendorRepository:IVendorRepository){}

 async execute(email: string): Promise<RegistervendorDto | null> {
    const vendor = await this._vendorRepository.findByEmail(email);
    return vendor;
 }
}