import { CreateCheckoutSessionDTO } from "../../dto/Subscription/CreateCheckoutSessionDto";

export interface IGetSubscriptionBookingUseCase {
  execute(): Promise<CreateCheckoutSessionDTO[]>;
}
