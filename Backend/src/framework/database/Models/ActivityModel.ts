import { model, ObjectId } from "mongoose";

import { Activity } from "../../../domain/entities/ActivityEntity";
import { ActivitySchema } from "../Schema/ActivitySchema";

export interface IActivityModel extends Omit<Activity,"id">,Document{
    _id:ObjectId
}
export const ActivityModel=model<IActivityModel>("Activity",ActivitySchema)