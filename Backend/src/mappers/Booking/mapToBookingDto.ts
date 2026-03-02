import { BookingDataDto } from "../../domain/dto/Booking/BookingDataDto";
import { Booking } from "../../domain/entities/BookingEntity";

export const mapBookingToCreateBookingDto = (bookings: Booking[]): BookingDataDto[] => {
  return bookings.map((b): BookingDataDto => ({
    _id: b._id ?? "",
    bookingId: b.bookingId,
    userId: b.userId,
    contactInfo: b.contactInfo,
    adults: b.adults || [],
    children: b.children || [],
    selectedPackage: (() => {
      const pkg = { ...b.selectedPackage };
      const rawPkgId = pkg.packageId || pkg._id;

      if (rawPkgId && typeof rawPkgId === 'object') {
        const rawObj = rawPkgId as unknown as { _id?: { toString(): string }; toString(): string };
        pkg._id = rawObj._id?.toString() || rawObj.toString();
      } else if (rawPkgId) {
        pkg._id = rawPkgId.toString();
      }
      return pkg;
    })(),
    selectedDate: b.selectedDate,
    totalAmount: b.totalAmount,
    paymentIntentId: b.paymentIntentId,
    paymentStatus: b.paymentStatus,
    payment_id: b.paymentIntentId || "",
    bookingStatus: b.bookingStatus,
    settlementDone: b.settlementDone,
    createdAt: b.createdAt,
    vendorId: b.vendorId || (() => {
      const pkg = b.selectedPackage;
      const pkgId = pkg.packageId || pkg._id;
      if (pkgId && typeof pkgId === 'object') {
        return (pkgId as unknown as { vendorId: string }).vendorId;
      }
      return undefined;
    })()
  }));
};
