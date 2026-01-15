import { ActivityDto } from "../../dto/Package/ActivityDto";

export interface IsearchActivityUsecase {
    execute(query: string): Promise<ActivityDto[]>
}