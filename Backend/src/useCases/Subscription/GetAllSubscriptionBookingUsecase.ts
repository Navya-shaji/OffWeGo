import { SubscriptionBookingDto } from "../../domain/dto/Subscription/SubscriptionBookingDto";
import { IGetSubscriptionBookingUseCase } from "../../domain/interface/SubscriptionPlan/IGetAllSubscriptionBookingUsecase";
import { ISubscriptionBookingRepository } from "../../domain/interface/SubscriptionPlan/ISubscriptionBookingRepo";
import { mapBookingToSubscriptionBookingDto } from "../../mappers/Subscription/subscription";

export class GetSubscriptionBookingUseCase
  implements IGetSubscriptionBookingUseCase {

  constructor(
    private _subscriptionBookingRepo: ISubscriptionBookingRepository
  ) { }

  async execute(page: number, limit: number): Promise<{ bookings: SubscriptionBookingDto[]; total: number }> {
    const skip = (page - 1) * limit;
    const { bookings, total } = await this._subscriptionBookingRepo.getAllSubscriptions(skip, limit);

    return {
      bookings: bookings.map(mapBookingToSubscriptionBookingDto),
      total
    };
  }
}
