import { Activity } from "../../domain/entities/ActivityEntity";
import { IActivityRepository } from "../../domain/interface/vendor/IactivityRepository";
import { IGetAllActivities } from "../../domain/interface/vendor/IgetallActivitiesUsecase";
import { mapToActivityDto } from "../../mappers/Activity/ActivityMapper";

export class GetAllActivitiesUsecase implements IGetAllActivities{
    constructor(private _activityRepo:IActivityRepository){}

    async execute(page:number,limit:number):Promise<{activity:Activity[],totalActivities:number}>{
        const skip=(page-1)*limit
        const activity=await this._activityRepo.getAllActivity(skip,limit)
        const totalActivity=await this._activityRepo.countActivity()
        return {
            activity:activity.map(mapToActivityDto),
            totalActivities:totalActivity
        }
    }
}