import { Schema } from "mongoose";

export const packageSchema = new Schema({
  destinationId: { type: String, required: true },
  packageName: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  duration: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  images: {
    type: [String],
    required: true,
  },
  hotelDetails: [
    {
      hotelId: { type: String, required: true },
      name: { type: String, required: true },
      address: { type: String, required: true },
      rating: { type: Number, required: true },
      destinationId: { type: String, required: true },
    },
  ],
  activities: [
    {
      activityId: { type: String, required: true },
      title: { type: String, required: true },
      description: { type: String, required: true },
      destinationId: { type: String, required: true },
    },
  ],
}, {
  timestamps: true,
});
