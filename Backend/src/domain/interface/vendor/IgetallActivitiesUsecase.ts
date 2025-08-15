import { Activity } from "../../entities/ActivityEntity";

export interface IGetAllActivities{
    execute(page:number,limit:number):Promise<{activity:Activity[],totalActivities:number}>
}