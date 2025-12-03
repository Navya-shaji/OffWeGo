import { Schema } from "mongoose";

export const NotificationSchema = new Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  recipientType: {
    type: String,
    enum: ["admin", "vendor", "user"],
    required: true,
  },
  recipientId: { type: String, required: true },
  tokens: [{ type: String }],
  topic: { type: String },
  createdAt: { type: Date, default: Date.now },
});
