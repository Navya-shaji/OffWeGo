import { ICreateBookingSubscriptionRequest } from "./ICreateBookingSubscriptionRequest";
import { ICreateBookingSubscriptionResponse } from "./ICreateBookingSubscriptionResponse";

export interface ICreateBookingSubscriptionUseCase {
  execute(
    data: ICreateBookingSubscriptionRequest
  ): Promise<ICreateBookingSubscriptionResponse>;
}