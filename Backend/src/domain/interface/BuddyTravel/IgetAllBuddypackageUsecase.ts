import { BuddyTravelDto } from "../../dto/BuddyTravel/BuddyTravelDto";

export interface IGetAllBuddyPackageUsecase{
    execute():Promise<BuddyTravelDto[]>
}