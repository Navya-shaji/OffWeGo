import { Document, model, models, Types } from "mongoose";
import { TravelPostSchema } from "../Schema/TravelPostSchema";

export interface ITravelPostDocument extends Document {
  authorId: Types.ObjectId;
  title: string;
  slug: string;
  categoryId: Types.ObjectId;
  destinationId?: Types.ObjectId;
  coverImageUrl?: string;
  galleryUrls: string[];
  content: string;
  excerpt: string;
  tags: string[];
  tripDate?: Date;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectedReason?: string;
  metrics: {
    views: number;
    likes: number;
  };
  viewedBy: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export const TravelPostModel =
  models.TravelPost || model<ITravelPostDocument>("TravelPost", TravelPostSchema);
