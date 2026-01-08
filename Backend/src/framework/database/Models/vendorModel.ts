import { model, Document, ObjectId } from "mongoose";
import { Vendor } from "../../../domain/entities/VendorEntities";
import { vendorSchema } from "../Schema/vendorSchema";


export interface IVendorModel extends Omit<Vendor, "_id">, Document {
  _id: ObjectId;
}

export const VendorModel = model<IVendorModel>("vendor", vendorSchema);
