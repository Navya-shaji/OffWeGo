import { SubscriptionPlanDto } from "../../domain/dto/Subscription/CreatesubscriptionDto";
import { ISubscriptionPlanModel } from "../../framework/database/Models/subscriptionModel";

export const mapModelToSubscriptionDto = (
  model: ISubscriptionPlanModel
): SubscriptionPlanDto => ({
  _id: model._id.toString(),
  name: model.name,
  price: model.price,
  maxPackages: model.maxPackages,
  duration: model.duration,
   stripePriceId: model.stripePriceId,
});
