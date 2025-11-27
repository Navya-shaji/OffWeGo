
import { Schema } from "mongoose";

export const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: Number },
  password: { type: String },
  imageUrl: { type: String },
  createdAt: { type: Date },
status: {
  type: String,
  enum: ["active", "blocked"], 
  default: "active",
},
  role: {
    type: String,
    enum: ["user", "vendor", "admin"],
    default: "user"
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
 
  googleVerified: {
    type: Boolean,
    default: false
  },
  fcmToken: { type: String, default: "" },
}, {
  timestamps: true
});
