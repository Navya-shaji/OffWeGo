import cron from "node-cron";
import { WalletRepository } from "../../adapters/repository/Wallet/walletRepository";
import { BookingRepository } from "../../adapters/repository/Booking/BookingRepository";
import { PackageRepository } from "../../adapters/repository/Package/PackageRepository";
import { CompleteTripUseCase } from "../../useCases/wallet/completedTripUsecase";
import { BuddyTravelRepository } from "../../adapters/repository/BuddyTravel/buddyTravelRepository";

const walletRepo = new WalletRepository();
const bookingRepo = new BookingRepository();
const packageRepo = new PackageRepository();
const buddyTravelRepo = new BuddyTravelRepository();

const completeTrip = new CompleteTripUseCase(
  walletRepo,
  bookingRepo,
  packageRepo
);

// Cron job to auto-update Buddy Travel trip status based on dates
export const updateBuddyTravelTripStatus = cron.schedule("0 * * * *", async () => {
  console.log("🔄 Checking Buddy Travel trip statuses...");
  try {
    const now = new Date();
    const allTrips = await buddyTravelRepo.findAll();

    for (const trip of allTrips) {
      const startDate = new Date(trip.startDate);
      const endDate = new Date(trip.endDate);
      
      let newTripStatus: "UPCOMING" | "ONGOING" | "COMPLETED";

      if (now < startDate) {
        newTripStatus = "UPCOMING";
      } else if (now >= startDate && now <= endDate) {
        newTripStatus = "ONGOING";
      } else {
        newTripStatus = "COMPLETED";
      }

      // Only update if status changed
      if (trip.tripStatus !== newTripStatus) {
        await buddyTravelRepo.updateTripStatus(trip._id.toString(), newTripStatus);
        console.log(`✅ Updated trip ${trip._id}: ${trip.tripStatus} → ${newTripStatus}`);
      }
    }
    console.log("✅ Buddy Travel trip status check completed");
  } catch (error) {
    console.error("❌ Error updating Buddy Travel trip statuses:", error);
  }
});

export const autoSettleTrips = cron.schedule("*/1 * * * *", async () => {
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
