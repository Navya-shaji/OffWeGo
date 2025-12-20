import { CreateCheckoutSessionDTO } from "../../dto/Subscription/createCheckoutSessionDto";

export interface IGetSubscriptionBookingUseCase {
  execute(): Promise<CreateCheckoutSessionDTO[]>;
}
