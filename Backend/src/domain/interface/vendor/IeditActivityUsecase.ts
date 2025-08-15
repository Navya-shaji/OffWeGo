import { Activity } from "../../entities/ActivityEntity";

export interface IEditActivityUsecase{
    execute(id:string,updatedData:Activity):Promise<Activity |null>
}