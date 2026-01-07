import Stripe from "stripe";
import { SubscriptionPlanDto } from "../../domain/dto/Subscription/createsubscriptionDto";
import { ICreateSubscriptionPlanUseCase } from "../../domain/interface/SubscriptionPlan/ICreateUsecase";
import { ISubscriptionPlanRepository } from "../../domain/interface/SubscriptionPlan/ISubscriptionplan";
import { IVendorRepository } from "../../domain/interface/Vendor/IVendorRepository";
import { INotificationService } from "../../domain/interface/Notification/ISendNotification";
import { mapModelToSubscriptionDto } from "../../mappers/Subscription/mapDtoToSubscriptionModel";
import { Role } from "../../domain/constants/Roles";

export class CreateSubscriptionUseCase implements ICreateSubscriptionPlanUseCase {
  constructor(
    private _subscriptionRepo: ISubscriptionPlanRepository,
    private _vendorRepo: IVendorRepository,
    private _notificationService: INotificationService
  ) {}

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

    const createdPlan = await this._subscriptionRepo.create(planDataWithStripe as any);

    const allVendors = await this._vendorRepo.findAll();
    const notificationPromises = allVendors.map(vendor =>
      this._notificationService.send({
        recipientId: vendor._id.toString(),
        recipientType: Role.VENDOR,
        title: "New Subscription Plan Available",
        message: `A new subscription plan "${data.name}" is now available.`,
        createdAt: new Date(),
        read:false
      })
    );
    await Promise.all(notificationPromises);

    return mapModelToSubscriptionDto(createdPlan as any);
  }
}
