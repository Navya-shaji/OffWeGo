import mongoose, { Schema } from "mongoose";

export const PackageWiseGroupingSchema=new Schema({
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },
  startDate: Date,
  endDate: Date,
  minPeople: Number,
  maxPeople: Number,
  currentBookings: { type: Number, default: 0 },
  status: { type: String, enum: ["open", "cancelled", "completed"], default: "open" },
})