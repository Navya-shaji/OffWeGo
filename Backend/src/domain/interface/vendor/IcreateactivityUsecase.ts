import { ActivityDto } from "../../dto/package/ActivityDto";
import { Activity } from "../../entities/ActivityEntity";

export interface IcreateActivityUsecase{
    execute(data:Activity):Promise<ActivityDto>
}