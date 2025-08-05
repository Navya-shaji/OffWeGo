import { Vendor } from "../../../domain/entities/vendorEntities";
import { VendorModel } from "../../../framework/database/Models/vendorModel";
import { mapToVendor } from "../../../mappers/Vendor/vendorMapper";

export class EditVendorProfile{
    async execute(id:string,updatedData:Vendor):Promise<Vendor|null>{
        const updatedDoc=await VendorModel.findByIdAndUpdate(id,updatedData)

        return updatedDoc?mapToVendor(updatedDoc):null
    }
}