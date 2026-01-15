import { ActivityDto } from "../../dto/Package/ActivityDto";
import { Activity } from "../../entities/ActivityEntity";

export interface IEditActivityUsecase {
    execute(id: string, updatedData: Activity): Promise<ActivityDto | null>
}