
import { model, Document, ObjectId } from "mongoose";
import { Destination } from "../../../domain/entities/DestinationEntity";
import { destinationSchema } from "../Schema/destinationSchema";

export interface IDestinationModel extends Omit<Destination, "id">, Document {
  _id: ObjectId;
}

export const DestinationModel = model<IDestinationModel>("destination", destinationSchema);
