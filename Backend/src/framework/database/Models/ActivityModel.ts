import { model, ObjectId, Document } from "mongoose";

import { Activity } from "../../../domain/entities/ActivityEntity";
import { ActivitySchema } from "../Schema/ActivitySchema";

export interface IActivityModel extends Omit<Activity,"_id">,Document{
    _id:ObjectId
}
export const ActivityModel=model<IActivityModel>("Activity",ActivitySchema)