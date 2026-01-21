import Stripe from "stripe";
import { CreateSubscriptionDto } from "../../domain/dto/Subscription/CreateSubscriptionDto";
import { ICreateSubscriptionUseCase } from "../../domain/interface/SubscriptionPlan/ICreateUsecase";
import { ISubscriptionPlanRepository } from "../../domain/interface/SubscriptionPlan/ISubscriptionplan";
import { IVendorRepository } from "../../domain/interface/Vendor/IVendorRepository";
import { INotificationService } from "../../domain/interface/Notification/ISendNotification";
import { mapModelToSubscriptionDto } from "../../mappers/Subscription/mapDtoToSubscriptionModel";
import { Role } from "../../domain/constants/Roles";

export class CreateSubscriptionUseCase implements ICreateSubscriptionUseCase {
  constructor(
    private _subscriptionRepo: ISubscriptionPlanRepository,
    private _vendorRepo: IVendorRepository,
    private _notificationService: INotificationService
  ) { }

  async execute(data: CreateSubscriptionDto): Promise<CreateSubscriptionDto> {
    if (!data.name || data.name.trim() === "") {
      throw new Error("Subscription plan name cannot be empty");
    }

    if (!data.features || data.features.length === 0) {
      throw new Error("Subscription plan must have at least one feature");
    }

    const existingPlan = await this._subscriptionRepo.findByName(data.name);
    if (existingPlan) {
      throw new Error("Subscription plan with this name already exists");
    }

    if (data.price < 0 || data.duration < 0) {
      throw new Error("Price and duration cannot be negative");
    }

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const createdPlan = await this._subscriptionRepo.create(planDataWithStripe as any);

    const allVendors = await this._vendorRepo.findAll();
    const notificationPromises = allVendors.map(vendor =>
      this._notificationService.send({
        recipientId: vendor._id.toString(),
        recipientType: Role.VENDOR,
        title: "New Subscription Plan Available",
        message: `A new subscription plan "${data.name}" is now available.`,
        createdAt: new Date(),
        read: false
      })
    );
    await Promise.all(notificationPromises);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return mapModelToSubscriptionDto(createdPlan as any);
  }
}
