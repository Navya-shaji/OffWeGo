import { ObjectId } from "mongoose";

export interface Activity {
  _id?:ObjectId,
  activityId?: string;
  title: string;
  description: string;
  destinationId?: string;
  imageUrl?:string
}
