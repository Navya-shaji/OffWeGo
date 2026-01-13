import { Schema } from "mongoose";

export const TravelPostSchema = new Schema(
  {
    authorId: { type: Schema.Types.ObjectId, ref: "user", required: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "category", required: true },
    destinationId: { type: Schema.Types.ObjectId, ref: "destination" },
    coverImageUrl: { type: String },
    galleryUrls: { type: [String], default: [] },
    content: { type: String, required: true },
    excerpt: { type: String, required: true },
    tags: { type: [String], default: [] },
    tripDate: { type: Date },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    rejectedReason: { type: String },
    metrics: {
      views: { type: Number, default: 0 },
      likes: { type: Number, default: 0 },
    },
    viewedBy: [{ type: Schema.Types.ObjectId, ref: "user", default: [] }],
  },
  {
    timestamps: true,
  }
);
