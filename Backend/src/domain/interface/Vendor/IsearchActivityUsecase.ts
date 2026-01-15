import { ActivityDto } from "../../dto/package/ActivityDto";

export interface IsearchActivityUsecase{
    execute(query:string):Promise<ActivityDto[]>
}