import { ActivityDto } from "../../domain/dto/package/ActivityDto";
import { Activity } from "../../domain/entities/ActivityEntity";
import { IActivityRepository } from "../../domain/interface/Vendor/IactivityRepository";
import { IEditActivityUsecase } from "../../domain/interface/Vendor/IeditActivityUsecase";
import { mapToActivityDto } from "../../mappers/Activity/ActivityMapper";

export class EditActivity implements IEditActivityUsecase {
  constructor(private _ActivityRepo: IActivityRepository) {}

  async execute(id: string, updatedData: Activity): Promise<ActivityDto | null> {
    const existing = await this._ActivityRepo.findByTitle(updatedData.title);
    if (existing && existing.activityId) throw new Error("Activity with this title already exists");
    const updatedDoc = await this._ActivityRepo.edit(id, updatedData);
    return updatedDoc ? mapToActivityDto(updatedDoc) : null;
  }
}
