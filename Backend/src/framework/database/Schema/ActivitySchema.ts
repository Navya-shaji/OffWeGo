import { Schema } from "mongoose";

export const ActivitySchema = new Schema({
  activityId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  destinationId: {
    type: String,
    required: true,
  },
});
