import { Document, model, ObjectId } from "mongoose";
import { Package } from "../../../domain/entities/PackageEntity";
import { packageSchema } from "../Schema/packageSchema";

export interface IPackageModel extends Omit<Package, "id">, Document {
  _id: ObjectId;

  flightOption: boolean;
  flight?: {
    id: string;
    fromLocation: string;
    toLocation: string;
    airLine: string;
    date: Date;
    price: number;
  } | null;
}

export const packageModel = model<IPackageModel>("Package", packageSchema);
