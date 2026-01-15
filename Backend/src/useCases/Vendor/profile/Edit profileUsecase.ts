import { Vendor } from "../../../domain/entities/VendorEntities";
import { VendorModel } from "../../../framework/database/Models/vendorModel";
import { mapToVendor } from "../../../mappers/Vendor/vendorMapper";

export class EditVendorProfile{
    async execute(id:string,updatedData:Vendor):Promise<Vendor|null>{
        const updatedDoc=await VendorModel.findByIdAndUpdate(id,updatedData,{new:true})

        return updatedDoc?mapToVendor(updatedDoc):null
    }
}