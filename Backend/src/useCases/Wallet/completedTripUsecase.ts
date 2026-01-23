import { IBookingRepository } from "../../domain/interface/Booking/IBookingRepository";
import { IPackageRepository } from "../../domain/interface/Vendor/iPackageRepository";
import { ICompleteTripUseCase } from "../../domain/interface/Wallet/ICompletedTripUsecase";
import { IWalletRepository } from "../../domain/interface/Wallet/IWalletRepository";
import { IUserRepository } from "../../domain/interface/UserRepository/IuserRepository";
import { IVendorRepository } from "../../domain/interface/Vendor/IVendorRepository";

export class CompleteTripUseCase implements ICompleteTripUseCase {
  constructor(
    private _walletRepository: IWalletRepository,
    private _bookingRepository: IBookingRepository,
    private _packageRepository: IPackageRepository,
    private _userRepository: IUserRepository,
    private _vendorRepository: IVendorRepository
  ) { }

  async execute(
    bookingRefId: string,
    vendorId: string,
    adminId: string,
    totalAmount: number
  ): Promise<void> {
    console.log(bookingRefId, adminId, totalAmount, "booking refId in usecase");

    const bookings = await this._bookingRepository.findByRefId(bookingRefId);

    if (!bookings || bookings.length === 0) {
      throw new Error("No bookings found with this reference ID");
    }

    for (const booking of bookings) {
      const startDate = new Date(booking.startDate);

      const packageData = await this._packageRepository.getById(
        booking.selectedPackage._id
      );
      console.log(packageData, "packageData")
      if (!packageData) continue;

      const durationInDays = packageData.duration;

      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + durationInDays);

      const now = new Date();

      if (now < endDate) continue;

      const existingTransaction =
        await this._walletRepository.getTransactionByRef(bookingRefId, adminId);

      console.log(existingTransaction, "existing tx");

      if (!existingTransaction) continue;

      if (existingTransaction.status === "completed") continue;

      const vendorAmount = booking.totalAmount * 0.9;

      const user = await this._userRepository.findById(booking.userId);
      const vendorData = await this._vendorRepository.findById(packageData.vendorId);

      const userName = user?.name || 'Unknown User';
      const vendorName = vendorData?.name || 'Unknown Vendor';


      await this._walletRepository.updateBalance(
        adminId,
        "admin",
        vendorAmount,
        "debit",
        `Settlement paid to vendor ${vendorName} (User: ${userName})`,
        booking.bookingId
      );

      await this._walletRepository.updateBalance(
        packageData.vendorId,
        "vendor",
        vendorAmount,
        "credit",
        "Trip completed earning",
        booking.bookingId
      );

      await this._walletRepository.updateTransactionStatus(
        adminId,
        booking.bookingId,
        "completed"
      );


    }
  }
}
