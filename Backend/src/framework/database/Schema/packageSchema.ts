import { Schema } from "mongoose";

export const packageSchema = new Schema(
  {
    destinationId: {
      type: Schema.Types.ObjectId,
      ref: "Destination",
      required: true,
    },
    packageName: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    duration: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    images: {
      type: [String],
      required: true,
    },

    hotels: [{ type: Schema.Types.ObjectId, ref: "Hotel" }],

    activities: [
      {
        type: Schema.Types.ObjectId,
        ref: "Activity",
      },
    ],

    checkInTime: { type: String },
    checkOutTime: { type: String },

    itinerary: [
      {
        day: { type: Number, required: true },
        time: { type: String },
        activity: { type: String, required: true },
      },
    ],

    inclusions: [{ type: String }],
    amenities: [{ type: String }],
    vendorId:{type:String}
  },
  {
    timestamps: true,
  }
);
