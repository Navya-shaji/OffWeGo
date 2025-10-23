import { Activity } from "../../../domain/entities/ActivityEntity";
import { IActivityRepository } from "../../../domain/interface/Vendor/IactivityRepository";
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

  async createActivity(data: Activity): Promise<IActivityModel> {
    return this.create(data);
  }

  async getAllActivity(skip: number, limit: number): Promise<IActivityModel[]> {
    return this.model.find().skip(skip).limit(limit);
  }

  async edit(
    id: string,
    updatedData: Partial<Activity>
  ): Promise<IActivityModel | null> {
    return this.update(id, updatedData);
  }

  async delete(id: string): Promise<IActivityModel | null> {
    return super.delete(id);
  }

  async searchActivity(query: string): Promise<Activity[]> {
    const regex = new RegExp(query, "i");
    return this.model
      .find({
        $or: [{ title: { $regex: regex } }, { description: { $regex: regex } }],
      })
      .select("title description imageUrl")
      .limit(10)
      .exec();
  }

  async countActivity(): Promise<number> {
    return this.model.countDocuments();
  }

  async findByTitle(title: string): Promise<Activity | null> {
    return this.model.findOne({ title });
  }
}
