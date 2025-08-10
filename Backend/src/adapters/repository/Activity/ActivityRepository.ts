import { Activity } from "../../../domain/entities/ActivityEntity";
import { IActivityRepository } from "../../../domain/interface/vendor/IactivityRepository";
import { ActivityModel, IActivityModel } from "../../../framework/database/Models/ActivityModel";

export class ActivityRepository implements  IActivityRepository{
    async createAtivity(data: Activity): Promise<IActivityModel> {
        return await ActivityModel.create(data)
    }
    async getAllActivity(): Promise<IActivityModel[]> {
        return await ActivityModel.find()
    }
}