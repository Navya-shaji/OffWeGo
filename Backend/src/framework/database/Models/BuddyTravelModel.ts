import { model, Document, ObjectId } from "mongoose";
import { BuddyTravel } from "../../../domain/entities/BuddyTripEntity";
import { buddyTravelSchema } from "../Schema/BuddyTravelSchema";


export interface IBuddyTravelModel
  extends Omit<BuddyTravel, "id">,
    Document {
  _id: ObjectId;
}

export const BuddyTravelModel = model<IBuddyTravelModel>(
  "buddyTravel",
  buddyTravelSchema
);
