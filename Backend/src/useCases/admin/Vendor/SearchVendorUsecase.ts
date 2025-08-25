import { Vendor } from "../../../domain/entities/vendorEntities";
import { ISearchVendorUSecase } from "../../../domain/interface/admin/ISearchVendorUseCase";
import { IVendorRepository } from "../../../domain/interface/vendor/IVendorRepository";

export class SearchVendorUsecase implements ISearchVendorUSecase{
    constructor(private _vendorRepository:IVendorRepository){}

    async execute(query:string):Promise<Vendor[]>{
        const result =await this._vendorRepository.searchVendor(query)
        return result
    }
}