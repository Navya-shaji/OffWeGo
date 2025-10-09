import { CreateSubscriptionDTO } from "../../domain/dto/Subscription/createsubscriptionDto";
import { ISubscriptionPlanModel } from "../../framework/database/Models/subscriptionModel";

// Only map fields that exist in the schema
export const mapDtoToPartialModel = (
  dto: CreateSubscriptionDTO
): Partial<ISubscriptionPlanModel> => ({
  name: dto.name,
  description: dto.description,
  price: dto.price,
  durationInDays: dto.durationInDays,
  commissionRate: dto.commissionRate,
});
