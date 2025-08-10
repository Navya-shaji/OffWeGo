import { Activity } from "../../domain/entities/ActivityEntity";
import { IActivityModel } from "../../framework/database/Models/ActivityModel";

export const mapToActivityDto=(doc:IActivityModel):Activity=>({
    activityId:doc.activityId,
    title:doc.title,
    description:doc.description,
    destinationId:doc.destinationId
})