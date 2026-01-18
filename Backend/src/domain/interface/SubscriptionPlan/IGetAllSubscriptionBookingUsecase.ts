import { SubscriptionBookingDto } from "../../dto/Subscription/SubscriptionBookingDto";

export interface IGetSubscriptionBookingUseCase {
  execute(): Promise<SubscriptionBookingDto[]>;
}
