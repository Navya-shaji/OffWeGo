import { Schema } from "mongoose";

export const buddyTravelSchema = new Schema(
  {
    vendorId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    destination: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    price: { type: Number, required: true },
    maxPeople: { type: Number, required: true },

    joinedUsers: [
      {
        type: String,
      },
    ],

    itinerary: [
      {
        day: { type: Number, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        time: { type: String },
      },
    ],

    hotels: [
      {
        name: { type: String, required: true },
        address: { type: String, required: true },
        rating: { type: Number, required: true },
        destinationId: { type: String, required: true },
      },
    ],

    activities: [
      {
        id: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        imageUrl: { type: String, required: true },
        destinationId: { type: String, required: true },
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
