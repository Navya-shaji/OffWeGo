import { SubscriptionPlanDto } from "../../domain/dto/Subscription/createsubscriptionDto";
import { ISubscriptionPlanModel } from "../../framework/database/Models/subscriptionModel";

export const mapModelToSubscriptionDto = (
  model: ISubscriptionPlanModel
): SubscriptionPlanDto => ({
  _id: model._id.toString(),
  name: model.name,
  price: model.price,
  duration: model.duration,
  features: model.features ?? [],
  stripePriceId: model.stripePriceId,
  isActive: model.isActive,
});
