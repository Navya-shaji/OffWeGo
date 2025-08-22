import { Activity } from "../../domain/entities/ActivityEntity";
import { IActivityRepository } from "../../domain/interface/vendor/IactivityRepository";
import { IcreateActivityUsecase } from "../../domain/interface/vendor/IcreateactivityUsecase";
import { mapToActivityDto } from "../../mappers/Activity/ActivityMapper";

export class createActivityUsecase implements IcreateActivityUsecase {
  constructor(private _activityRepo: IActivityRepository) {}

  async execute(data: Activity): Promise<Activity> {
    const existing = await this._activityRepo.findByTitle(data.title);
    if (existing) throw new Error("Activity with this title already exists");
    const Activity = await this._activityRepo.createAtivity(data);
    return mapToActivityDto(Activity);
  }
}
