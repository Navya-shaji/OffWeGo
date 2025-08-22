import { Activity } from "../../../domain/entities/ActivityEntity";
import { IActivityRepository } from "../../../domain/interface/vendor/IactivityRepository";
import {
  ActivityModel,
  IActivityModel,
} from "../../../framework/database/Models/ActivityModel";
import { BaseRepository } from "../BaseRepo/BaseRepo";

export class ActivityRepository
  extends BaseRepository<IActivityModel>
  implements IActivityRepository
{
  constructor() {
    super(ActivityModel);
  }
  async createAtivity(data: Activity): Promise<IActivityModel> {
    return await ActivityModel.create(data);
  }
  async getAllActivity(skip: number, limit: number): Promise<IActivityModel[]> {
    return await ActivityModel.find().skip(skip).limit(limit);
  }
  async edit(
    id: string,
    updatedData: Partial<Activity>
  ): Promise<IActivityModel | null> {
    return await ActivityModel.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
  }
  async delete(id: string): Promise<IActivityModel | null> {
    return await ActivityModel.findByIdAndDelete(id);
  }
  async searchActivity(query: string): Promise<Activity[]> {
    const regex = new RegExp(query, "i");
    return ActivityModel.find({
      $or: [{ title: { $regex: regex } }, { description: { $regex: regex } }],
    })
      .select("title description imageUrl")
      .limit(10)
      .exec();
  }

  async countActivity(): Promise<number> {
    return await ActivityModel.countDocuments();
  }
  async findByTitle(title: string): Promise<Activity | null> {
    return await ActivityModel.findOne({ title });
  }
}
