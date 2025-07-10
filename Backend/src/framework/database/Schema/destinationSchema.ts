
import { Schema } from "mongoose";

export const destinationSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
 imageUrls: {
  type: [String],
  required: true,
},
  location: { type: String, required: true },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
}, {
  timestamps: true,
});
