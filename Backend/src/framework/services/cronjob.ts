import cron from "node-cron";
import { WalletRepository } from "../../adapters/repository/Wallet/WalletRepository";
import { BookingRepository } from "../../adapters/repository/Booking/BookingRepository";
import { PackageRepository } from "../../adapters/repository/Package/PackageRepository";
import { CompleteTripUseCase } from "../../useCases/wallet/completedTripUsecase";
import { SubscriptionBookingRepository } from "../../adapters/repository/Booking/SubscriptionBookingRepo";
import { VendorRepository } from "../../adapters/repository/Vendor/VendorRepository";

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

  const subscriptionRepo = new SubscriptionBookingRepository();
  const vendorRepo = new VendorRepository();

  return cron.schedule("0 2 * * *", async () => {
    console.log("🕐 Starting daily cronjob - Trip Settlement & Subscription Check");

    // 1. Process trip settlements
    const bookings = await bookingRepo.findCompletedTrips();
    console.log(`📋 Found ${bookings.length} bookings to settle`);

    for (const booking of bookings) {
      try {
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

    // 2. Check subscription expirations
    try {
      const vendors = await vendorRepo.getAllVendors(0, 1000);
      console.log(`Checking subscriptions for ${vendors.length} vendors`);

      for (const vendor of vendors) {
        await subscriptionRepo.expireOldSubscriptions(vendor._id.toString());
      }
      console.log(" Subscription expiration check completed");
    } catch (err) {
      console.error(" Error checking subscriptions:", err);
    }

    console.log(" Daily cronjob completed");
  });
};
