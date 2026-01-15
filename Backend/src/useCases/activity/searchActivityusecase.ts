import { ActivityDto } from "../../domain/dto/Package/ActivityDto";
import { IActivityRepository } from "../../domain/interface/Vendor/IactivityRepository";
import { IsearchActivityUsecase } from "../../domain/interface/Vendor/IsearchActivityUsecase";
import { mapToActivityDtos } from "../../mappers/Activity/searchMapper";
export class SearchActivityusecase implements IsearchActivityUsecase {
    constructor(private _activityRepo: IActivityRepository) { }

    async execute(query: string): Promise<ActivityDto[]> {
        const result = await this._activityRepo.searchActivity(query)

        return mapToActivityDtos(result)
    }
}