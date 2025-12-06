import cron from "node-cron";
import { WalletRepository } from "../../adapters/repository/Wallet/walletRepository";
import { BookingRepository } from "../../adapters/repository/Booking/BookingRepository";
import { PackageRepository } from "../../adapters/repository/Package/PackageRepository";
import { CompleteTripUseCase } from "../../useCases/wallet/completedTripUsecase";

const walletRepo = new WalletRepository();
const bookingRepo = new BookingRepository();
const packageRepo = new PackageRepository();

const completeTrip = new CompleteTripUseCase(
  walletRepo,
  bookingRepo,
  packageRepo
);

// RUN EVERY 1 MINUTE
export const autoSettleTrips = cron.schedule("*/1 * * * *", async () => {
  console.log("⏳ Checking for completed trips...");

  // STEP 1: Get all pending bookings
  const bookings = await bookingRepo.findCompletedTrips();
  console.log("🟦 Pending bookings:", bookings.length);

  for (const booking of bookings) {
    try {
      // STEP 2: Load the package using selectedPackage ID
      const pkg = await packageRepo.getById(booking.selectedPackage as any);
      if (!pkg) {
        console.log("❌ Package not found:", booking.selectedPackage);
        continue;
      }

      const duration = pkg.duration; // <--- Correct duration field

      // STEP 3: Compute end date
      const startDate = new Date(booking.selectedDate);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + duration);

      const now = new Date();

      console.log(`📅 Trip end date: ${endDate}`);

      // STEP 4: If trip not finished → skip
      if (now < endDate) {
        console.log("⏸️ Trip not finished yet, skipping...");
        continue;
      }

      console.log("✅ Trip completed — settling:", booking.bookingId);

      // STEP 5: Run settlement
      await completeTrip.execute(
        booking.bookingId,
        booking.vendorId!,
        process.env.ADMIN_ID!,
        booking.totalAmount
      );

      // STEP 6: Update booking status
      await bookingRepo.update(booking._id as string, {
        settlementDone: true,
        bookingStatus: "completed"
      });

      console.log("💰 Settlement completed for:", booking.bookingId);
    } catch (err) {
      console.error("❌ Error settling booking:", err);
    }
  }
});
