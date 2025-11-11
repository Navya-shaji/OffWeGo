import { BuddyTravelDto } from "../../domain/dto/BuddyTravel/BuddyTravelDto";
import { IBuddyTravelRepository } from "../../domain/interface/BuddyTravel/IBuddyTravelRepository";
import { IJoinTravelUsecase } from "../../domain/interface/BuddyTravel/IJoinTravelUsecase";
import { IWalletRepository } from "../../domain/interface/Wallet/IWalletRepository";
import { Role } from "../../domain/constants/Roles";

export class JoinTravelUsecase implements IJoinTravelUsecase {
  constructor(
    private _buddyRepo: IBuddyTravelRepository,
    private _walletRepo: IWalletRepository
  ) {}

  async execute(
    userId: string,
    tripId: string,
    paymentId: string
  ): Promise<BuddyTravelDto> {
    // Step 1: User joins the trip
    const updatedTrip = await this._buddyRepo.joinBuddyTrip(tripId, userId);
    if (!updatedTrip) throw new Error("Failed to join the trip or trip not found");

    // Step 2: Payment simulation (already paid successfully via frontend)
    const paymentStatus = "succeeded";
    if (paymentStatus !== "succeeded") {
      throw new Error("Payment failed");
    }

    // Step 3: Wallet transaction logic
    const adminId = process.env.ADMIN_ID || "68666f952c4ebbe1b6989dd9";
    const vendorId = updatedTrip.vendorId.toString();
    const tripPrice = updatedTrip.price;

    // 🪙 Admin gets the total amount first (platform holding funds)
    await this._walletRepo.updateBalance(
      adminId,
      Role.ADMIN,
      tripPrice,
      "credit",
      `Buddy Trip booking received from user ${userId}`
    );

    await this._walletRepo.updateBalance(
      vendorId,
      Role.VENDOR,
      tripPrice,
      "credit",
      `User ${userId} joined the trip "${updatedTrip.title}"`
    );

    console.log("Payment & wallet update completed successfully");

    return updatedTrip as BuddyTravelDto;
  }
}
