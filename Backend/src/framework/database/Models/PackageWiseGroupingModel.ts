import { model, ObjectId } from "mongoose";
import { PackageWiseGroup } from "../../../domain/entities/PackagewiseGroup";
import { PackageWiseGroupingSchema } from "../Schema/PackageWiseGrouping";

export interface IPackageWiseGrouping extends Omit<PackageWiseGroup,"_id">,Document {
    _id:ObjectId
}

export const PackageWiseGroupingModel=model<IPackageWiseGrouping>("packagewiseGroup",PackageWiseGroupingSchema)