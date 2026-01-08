import cron from "node-cron";
import { WalletRepository } from "../../adapters/repository/Wallet/WalletRepository";
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


    const bookings = await bookingRepo.findCompletedTrips();
  

    for (const booking of bookings) {
      try {
        const pkg = await packageRepo.getById(booking.selectedPackage as any);
        if (!pkg) {
          continue;
        }

        const duration = pkg.duration;

        const startDate = new Date(booking.selectedDate);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + duration);

        const now = new Date();


        if (now < endDate) {
          continue;
        }


        await completeTrip.execute(
          booking.bookingId,
          booking.vendorId!,
          process.env.ADMIN_ID!,
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
