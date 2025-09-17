import { Document,model,ObjectId } from "mongoose";
import { Package } from "../../../domain/entities/PackageEntity";
import { packageSchema } from "../Schema/packageSchema";

export interface IPackageModel extends Omit<Package,"id">,Document{
    _id:ObjectId
}
export const packageModel=model<IPackageModel>("package",packageSchema)