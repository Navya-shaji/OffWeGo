import { Activity } from "../../entities/ActivityEntity";

export interface IcreateActivityUsecase{
    execute(data:Activity):Promise<Activity>
}