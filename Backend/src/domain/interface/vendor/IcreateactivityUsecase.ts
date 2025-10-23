import { ActivityDto } from "../../dto/package/ActivityDto";

export interface IcreateActivityUsecase{
    execute(data:ActivityDto,destinationId:string):Promise<ActivityDto>
}