import { Activity } from "../../domain/entities/ActivityEntity";
import { IActivityRepository } from "../../domain/interface/vendor/IactivityRepository";
import { IcreateActivityUsecase } from "../../domain/interface/vendor/IcreateactivityUsecase";
import { mapToActivityDto } from "../../mappers/Activity/ActivityMapper";

export class createActivityUsecase implements IcreateActivityUsecase{
    constructor(private activityRepo:IActivityRepository){}

    async execute(data: Activity): Promise<Activity> {
        const Activity=await this.activityRepo.createAtivity(data)
        return mapToActivityDto(Activity)
    }
}