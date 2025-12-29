import { Schema } from "mongoose";

export const buddyTravelSchema = new Schema(
  {
    vendorId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    categoryId: { 
      type: Schema.Types.ObjectId, 
      ref: "Category", 
      required: true 
    },
    destination: { type: String, required: true },
    location: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    price: { type: Number, required: true },
    maxPeople: { type: Number, required: true },
    images: { type: [String], default: [] },
    reservedSlots: { type: Number, default: 0 },

    joinedUsers: [
      {
        type: String,
      },
    ],

    includedFeatures: {
      food: { type: Boolean, default: false },
      stay: { type: Boolean, default: false },
      transport: { type: Boolean, default: false },
      activities: { type: Boolean, default: false },
      guide: { type: Boolean, default: false },
      insurance: { type: Boolean, default: false },
    },

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

    // Approval status (admin approval)
    status: {
      type: String,
      enum: ["PENDING", "ACTIVE", "CANCELLED", "COMPLETED", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    // Trip status based on dates (Upcoming, Ongoing, Completed)
    tripStatus: {
      type: String,
      enum: ["UPCOMING", "ONGOING", "COMPLETED"],
      default: "UPCOMING",
    },

    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);
