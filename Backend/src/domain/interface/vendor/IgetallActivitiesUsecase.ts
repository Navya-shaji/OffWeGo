import { Activity } from "../../entities/ActivityEntity";

export interface IGetAllActivities{
    execute():Promise<Activity[]>
}