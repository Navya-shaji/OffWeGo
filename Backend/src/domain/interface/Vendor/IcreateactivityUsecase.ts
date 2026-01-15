import { ActivityDto } from "../../dto/Package/ActivityDto";

export interface IcreateActivityUsecase {
    execute(data: ActivityDto, destinationId: string): Promise<ActivityDto>
}