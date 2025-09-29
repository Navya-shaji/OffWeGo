import { ActivityDto } from "../../domain/dto/package/ActivityDto";
import { Activity } from "../../domain/entities/ActivityEntity";
import { IActivityRepository } from "../../domain/interface/Vendor/IactivityRepository";
import { IcreateActivityUsecase } from "../../domain/interface/Vendor/IcreateactivityUsecase";
import { mapToActivityDto } from "../../mappers/Activity/ActivityMapper";

export class createActivityUsecase implements IcreateActivityUsecase {
  constructor(private _activityRepo: IActivityRepository) {}

  async execute(data: Activity): Promise<ActivityDto> {
    const existing = await this._activityRepo.findByTitle(data.title);
    if (existing) throw new Error("Activity with this title already exists");
    const Activity = await this._activityRepo.createActivity(data);
    return mapToActivityDto(Activity);
  }
}
