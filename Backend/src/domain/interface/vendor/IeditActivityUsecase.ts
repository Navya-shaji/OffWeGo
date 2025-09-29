import { ActivityDto } from "../../dto/package/ActivityDto";
import { Activity } from "../../entities/ActivityEntity";

export interface IEditActivityUsecase{
    execute(id:string,updatedData:Activity):Promise<ActivityDto |null>
}