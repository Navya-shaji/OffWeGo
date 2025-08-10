import { Schema } from "mongoose";

export const ActivitySchema = new Schema({
  activityId: { type: String },
  title: { type: String, required: true },
  description: { type: String, required: true },
  destinationId: {
    type: String,
    
  },
  imageUrl:{type :String}
});
