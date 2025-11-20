import { Schema } from "mongoose";

export const ChatMessageSchema = new Schema({
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  senderRole: { type: String, enum: ["user", "vendor"], required: true },
  receiverRole: { type: String, enum: ["user", "vendor"], required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
