import { Activity } from "../../domain/entities/ActivityEntity";
import { IActivityRepository } from "../../domain/interface/vendor/IactivityRepository";
import { IsearchActivityUsecase } from "../../domain/interface/vendor/IsearchActivityUsecase";

export class SearchActivityusecase implements IsearchActivityUsecase{
    constructor(private _activityRepo:IActivityRepository){}

    async execute(query: string): Promise<Activity[]> {
        const result=await this._activityRepo.searchActivity(query)
        
        return result
    }
}