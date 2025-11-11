import { BuddyTravelDto } from "../../dto/BuddyTravel/BuddyTravelDto";

export interface IGetVendorBuddyPackageUasecase{
    execute(vendorId:string):Promise<BuddyTravelDto[]>
}