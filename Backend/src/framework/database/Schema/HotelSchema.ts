import { Schema } from "mongoose";

export const HotelSchema = new Schema({
  hotelId: { type: String }, 
  name: { type: String, required: true },
  address: { type: String, required: true },
  rating: { type: Number, required: true },
  destinationId: {
    type: Schema.Types.ObjectId,
    ref: "Destination"
  }
});
