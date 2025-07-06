import { IVendorRepository } from "../../../domain/interface/vendor/IVendorRepository";

export class UpdateVendorstatusUseCase{
    constructor(private vendorRepository:IVendorRepository){}

    async execute(email:string,status:string):Promise<void>{
         await this.vendorRepository.updateStatus(email,status) 
    }
}