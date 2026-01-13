import { Schema } from "mongoose";

export const vendorSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number },
    password: { type: String },
    profileImage: { type: String },
    createdAt: { type: Date },
    documentUrl: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "active"],
      default: "pending",
    },
    rejectionReason: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["Vendor"],
      default: "Vendor",
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    googleVerified: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },

    packageLimit: {
      type: Number,
      default: 0,
    },
    currentPackages: {
      type: Number,
      default: 0,
    },
    fcmToken: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);
