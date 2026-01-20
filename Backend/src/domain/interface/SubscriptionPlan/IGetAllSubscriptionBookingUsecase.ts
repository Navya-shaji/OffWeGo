import { SubscriptionBookingDto } from "../../dto/Subscription/SubscriptionBookingDto";

export interface IGetSubscriptionBookingUseCase {
  execute(page: number, limit: number): Promise<{ bookings: SubscriptionBookingDto[]; total: number }>;
}
