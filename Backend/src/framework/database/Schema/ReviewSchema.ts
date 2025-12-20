import mongoose from "mongoose";

export const ReviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  packageName: { type: String, required: true },
  destination: { type: String, required: true },
  description: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  photo: { type: String }, 
  createdAt: { type: Date, default: Date.now },
});