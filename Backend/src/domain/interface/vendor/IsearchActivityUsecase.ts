import { Activity } from "../../entities/ActivityEntity";

export interface IsearchActivityUsecase{
    execute(query:string):Promise<Activity[]>
}