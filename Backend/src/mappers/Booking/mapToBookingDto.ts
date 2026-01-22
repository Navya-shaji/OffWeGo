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
      if (pkg && pkg._id && typeof pkg._id === 'object') {
        // @ts-expect-error - _id is populated
        pkg._id = (pkg._id as { _id: string })._id?.toString() || pkg._id.toString();
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
      const pkgId = b.selectedPackage?._id;
      if (pkgId && typeof pkgId === 'object') {
        return (pkgId as { vendorId: string }).vendorId;
      }
      return undefined;
    })()
  }));
};
