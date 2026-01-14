import { IActivityModel } from "../../../framework/database/Models/ActivityModel";
import { Activity } from "../../entities/ActivityEntity";

export interface IActivityRepository{
    createActivity(data:Activity):Promise<IActivityModel>
    getAllActivity(skip:number,limit:number):Promise<IActivityModel[]>
    edit(id: string, updatedData: Partial<Activity>): Promise<IActivityModel | null>;
    delete(id:string):Promise<IActivityModel|null>
    searchActivity(query:string):Promise<Activity[]>
    countActivity():Promise<number>
    findByTitle(title:string):Promise<Activity |null>
}