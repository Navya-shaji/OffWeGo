import { BuddyTravelDto } from "../../dto/BuddyTravel/BuddyTravelDto";

export interface IGetAllBuddyPackageUsecase{
    execute(categoryId?: string, page?: number, limit?: number):Promise<{
      packages: BuddyTravelDto[];
      totalPackages: number;
    }>
}