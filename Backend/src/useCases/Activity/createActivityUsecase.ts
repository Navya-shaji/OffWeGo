import { ActivityDto } from "../../domain/dto/Package/ActivityDto";
import { IActivityRepository } from "../../domain/interface/Vendor/IactivityRepository";
import { IcreateActivityUsecase } from "../../domain/interface/Vendor/IcreateactivityUsecase";
import { mapToActivityDto } from "../../mappers/Activity/activityMapper";

export class createActivityUsecase implements IcreateActivityUsecase {
  constructor(private _activityRepo: IActivityRepository) { }

  async execute(data: ActivityDto, destinationId: string): Promise<ActivityDto> {
    if (!destinationId) {
      throw new Error("Destination is required");
    }
    const existing = await this._activityRepo.findByTitle(data.title);
    if (existing) throw new Error("Activity with this title already exists");
    const activityDatawithDestination = { ...data, destinationId }
    const Activity = await this._activityRepo.createActivity(activityDatawithDestination);
    return mapToActivityDto(Activity);
  }
}
