import { IVendorRepository } from "../../../domain/interface/vendor/IVendorRepository";

export class GetVendorByEmailUseCase{
    constructor(private vendorRepository:IVendorRepository){}

    async execute(email:string){
        return await this.vendorRepository.findByEmail(email)
    }
}