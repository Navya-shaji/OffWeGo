import { SubscriptionBookingDto } from "../../domain/dto/Subscription/SubscriptionBookingDto";
import { ISubscriptionBooking } from "../../domain/entities/SubscriptionBookingEntity";

export function mapBookingToSubscriptionBookingDto(
  booking: any
): SubscriptionBookingDto {
  return {
    _id: booking._id.toString(),
    vendorId: booking.vendorId,
    vendorName: booking.vendorDetails?.name || booking.vendorDetails?.username,
    vendorEmail: booking.vendorDetails?.email,
    planId: booking.planId?._id?.toString() || booking.planId?.toString(),
    planName: booking.planName,
    amount: booking.amount,
    currency: booking.currency || "INR",
    status: booking.status,
    duration: booking.duration,
    features: booking.features || [],
    startDate: booking.startDate ? new Date(booking.startDate).toISOString() : undefined,
    endDate: booking.endDate ? new Date(booking.endDate).toISOString() : undefined,
    createdAt: booking.createdAt ? new Date(booking.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: booking.updatedAt ? new Date(booking.updatedAt).toISOString() : new Date().toISOString(),
    stripeSubscriptionId: booking.stripeSubscriptionId,
    domainUrl: booking.domainUrl || ""
  };
}

// Keep the old one for backward compatibility if needed, but point it to the new one or update it
export function mapBookingToCheckoutDTO(
  booking: ISubscriptionBooking
): any {
  return mapBookingToSubscriptionBookingDto(booking);
}
