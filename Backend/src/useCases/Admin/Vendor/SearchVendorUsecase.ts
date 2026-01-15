import { VendorDto } from "../../../domain/dto/Vendor/VendorDto";
import { ISearchVendorUSecase } from "../../../domain/interface/Admin/ISearchVendorUseCase";
import { IVendorRepository } from "../../../domain/interface/Vendor/IVendorRepository";

export class SearchVendorUsecase implements ISearchVendorUSecase{
    constructor(private _vendorRepository:IVendorRepository){}

    async execute(query:string):Promise<VendorDto[]>{
        const result =await this._vendorRepository.searchVendor(query)
        return result
    }
}