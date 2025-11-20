import Stripe from "stripe";
import { SubscriptionPlanDto } from "../../domain/dto/Subscription/createsubscriptionDto";
import { ICreateSubscriptionPlanUseCase } from "../../domain/interface/SubscriptionPlan/ICreateUsecase";
import { ISubscriptionPlanRepository } from "../../domain/interface/SubscriptionPlan/ISubscriptionplan";
import { mapModelToSubscriptionDto } from "../../mappers/Subscription/mapDtoToSubscriptionModel";

export class createSubscriptionusecase implements ICreateSubscriptionPlanUseCase {
  constructor(private _subscriptionRepo: ISubscriptionPlanRepository) {}

  async execute(data: SubscriptionPlanDto): Promise<SubscriptionPlanDto> {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-09-30.clover",
    });

    const product = await stripe.products.create({
      name: data.name,
    });

    const price = await stripe.prices.create({
      unit_amount: data.price * 100, 
      currency: "inr",
      recurring: { interval: "month" }, 
      product: product.id,
    });

    const planDataWithStripe = {
      ...data,
      stripePriceId: price.id,
    };

    const created = await this._subscriptionRepo.create(planDataWithStripe);

    return mapModelToSubscriptionDto(created);
  }
}
