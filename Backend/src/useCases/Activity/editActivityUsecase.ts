import { Activity } from "../../domain/entities/ActivityEntity";
import { IActivityRepository } from "../../domain/interface/vendor/IactivityRepository";
import { IEditActivityUsecase } from "../../domain/interface/vendor/IeditActivityUsecase";
import { mapToActivityDto } from "../../mappers/Activity/ActivityMapper";

export class EditActivity implements IEditActivityUsecase {
    constructor(private ActivityRepo: IActivityRepository) {}

    async execute(id: string, updatedData: Activity): Promise<Activity | null> {
        const updatedDoc = await this.ActivityRepo.edit(id, updatedData);
       return updatedDoc ? mapToActivityDto(updatedDoc):null
    }
}
