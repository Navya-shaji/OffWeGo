import { Document,model,ObjectId } from "mongoose";
import { Package } from "../../../domain/entities/packageEntity";
import { packageSchema } from "../Schema/packageSchema";

export interface IPackageModel extends Omit<Package,"id">,Document{
    _id:ObjectId
}
export const packageModel=model<IPackageModel>("package",packageSchema)