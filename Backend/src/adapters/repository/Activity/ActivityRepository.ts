import { Activity } from "../../../domain/entities/ActivityEntity";
import { IActivityRepository } from "../../../domain/interface/vendor/IactivityRepository";
import {
  ActivityModel,
  IActivityModel,
} from "../../../framework/database/Models/ActivityModel";

export class ActivityRepository implements IActivityRepository {
  async createAtivity(data: Activity): Promise<IActivityModel> {
    return await ActivityModel.create(data);
  }
  async getAllActivity(): Promise<IActivityModel[]> {
    return await ActivityModel.find();
  }
  async edit(
    id: string,
    updatedData: Partial<Activity>
  ): Promise<IActivityModel | null> {
    return await ActivityModel.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
  }

  async delete(id: string): Promise<void> {
    await ActivityModel.findByIdAndDelete(id);
  }
}
