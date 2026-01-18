import { SubscriptionBookingDto } from "../../domain/dto/Subscription/SubscriptionBookingDto";
import { IGetSubscriptionBookingUseCase } from "../../domain/interface/SubscriptionPlan/IGetAllSubscriptionBookingUsecase";
import { ISubscriptionBookingRepository } from "../../domain/interface/SubscriptionPlan/ISubscriptionBookingRepo";
import { mapBookingToSubscriptionBookingDto } from "../../mappers/Subscription/subscription";

export class GetSubscriptionBookingUseCase
  implements IGetSubscriptionBookingUseCase {

  constructor(
    private _subscriptionBookingRepo: ISubscriptionBookingRepository
  ) { }

  async execute(): Promise<SubscriptionBookingDto[]> {
    const bookings = await this._subscriptionBookingRepo.getAllSubscriptions();

    return bookings.map(mapBookingToSubscriptionBookingDto);
  }
}
