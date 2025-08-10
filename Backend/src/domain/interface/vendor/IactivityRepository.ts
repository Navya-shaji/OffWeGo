import { IActivityModel } from "../../../framework/database/Models/ActivityModel";
import { Activity } from "../../entities/ActivityEntity";

export interface IActivityRepository{
    createAtivity(data:Activity):Promise<IActivityModel>
    getAllActivity():Promise<IActivityModel[]>
}