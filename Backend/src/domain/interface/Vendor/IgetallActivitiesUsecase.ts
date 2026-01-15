import { ActivityDto } from "../../dto/package/ActivityDto";


export interface IGetAllActivities{
    execute(page:number,limit:number):Promise<{activity:ActivityDto[],totalActivities:number}>
}