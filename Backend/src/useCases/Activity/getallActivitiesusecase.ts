import { Activity } from "../../domain/entities/ActivityEntity";
import { IActivityRepository } from "../../domain/interface/vendor/IactivityRepository";
import { IGetAllActivities } from "../../domain/interface/vendor/IgetallActivitiesUsecase";

export class GetAllActivitiesUsecase implements IGetAllActivities{
    constructor(private activityRepo:IActivityRepository){}

    async execute():Promise<Activity[]>{
        const res=await this.activityRepo.getAllActivity()
        return res
    }
}