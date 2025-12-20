import { CreateCheckoutSessionDTO } from "../../domain/dto/Subscription/createCheckoutSessionDto";
import { IGetSubscriptionBookingUseCase } from "../../domain/interface/SubscriptionPlan/IGetAllSubscriptionBookingUsecase";
import { ISubscriptionBookingRepository } from "../../domain/interface/SubscriptionPlan/ISubscriptionBookingRepo";
import { mapBookingToCheckoutDTO } from "../../mappers/Subscription/subscription";

export class GetSubscriptionBookingUseCase
  implements IGetSubscriptionBookingUseCase {

  constructor(
    private _subscriptionBookingRepo: ISubscriptionBookingRepository
  ) {}

  async execute(): Promise<CreateCheckoutSessionDTO[]> {
    const bookings = await this._subscriptionBookingRepo.getAllSubscriptions();

    return bookings.map(mapBookingToCheckoutDTO);
  }
}
