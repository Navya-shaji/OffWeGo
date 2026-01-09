import { CreateCheckoutSessionDTO } from "../../domain/dto/Subscription/CreateCheckoutSessionDto";
import { ISubscriptionBooking } from "../../domain/entities/SubscriptionBookingEntity";


export function mapBookingToCheckoutDTO(
  booking: ISubscriptionBooking
): CreateCheckoutSessionDTO {



  return {
    vendorId: booking.vendorId,
    planId: booking.planId.toString(),
    planName: booking.planName,
    amount: booking.amount,
    duration: booking.duration,
    features: booking.features,
    domainUrl: "" 
  };
}
