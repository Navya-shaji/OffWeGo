import { Schema } from "mongoose";

export const buddyTravelSchema = new Schema(
  {
    vendorId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    maxPeople: {
      type: Number,
      required: true,
    },
    joinedUsers: [
      {
        type: String, // store user IDs
      },
    ],
    status: {
      type: String,
      enum: ["PENDING", "ACTIVE", "CANCELLED", "COMPLETED", "APPROVED"],
      default: "PENDING",
    },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);
