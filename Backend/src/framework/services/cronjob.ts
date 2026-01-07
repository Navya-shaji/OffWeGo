import cron from "node-cron";
import { WalletRepository } from "../../adapters/repository/Wallet/walletRepository";
import { BookingRepository } from "../../adapters/repository/Booking/BookingRepository";
import { PackageRepository } from "../../adapters/repository/Package/PackageRepository";
import { CompleteTripUseCase } from "../../useCases/wallet/completedTripUsecase";

export const createAutoSettlementCron = (
  walletRepo: WalletRepository,
  bookingRepo: BookingRepository,
  packageRepo: PackageRepository
) => {
  const completeTrip = new CompleteTripUseCase(
    walletRepo,
    bookingRepo,
    packageRepo
  );

  return cron.schedule("*/1 * * * *", async () => {
    console.log("Checking for completed trips...");

    const bookings = await bookingRepo.findCompletedTrips();
    console.log("Pending bookings:", bookings.length);

    for (const booking of bookings) {
      try {
        const pkg = await packageRepo.getById(booking.selectedPackage as any);
        if (!pkg) {
          console.log("Package not found:", booking.selectedPackage);
          continue;
        }

        const duration = pkg.duration;

        const startDate = new Date(booking.selectedDate);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + duration);

        const now = new Date();

        console.log(` Trip end date: ${endDate}`);

        if (now < endDate) {
          console.log(" Trip not finished yet, skipping...");
          continue;
        }

        console.log(" Trip completed — settling:", booking.bookingId);

        await completeTrip.execute(
          booking.bookingId,
          booking.vendorId!,
          process.env.ADMIN_ID!,
          booking.totalAmount
        );

        await bookingRepo.update(booking._id as string, {
          settlementDone: true,
          bookingStatus: "completed"
        });

        console.log(" Settlement completed for:", booking.bookingId);
      } catch (err) {
        console.error(" Error settling booking:", err);
      }
    }
  });
};
