import { SubscriptionBookingRepository } from "../../adapters/repository/Booking/subscriptionBookingRepo";
import { SubscriptionPlanRepository } from "../../adapters/repository/Subscription/subscriptionRepo";
import { ICreateBookingSubscriptionRequest } from "../../domain/interface/SubscriptionPlan/ICreateBookingSubscriptionRequest";
import { ICreateBookingSubscriptionResponse } from "../../domain/interface/SubscriptionPlan/ICreateBookingSubscriptionResponse";
import { ICreateBookingSubscriptionUseCase } from "../../domain/interface/SubscriptionPlan/ICreateBookingSubscriptionUsecase";
import { StripeService } from "../../framework/Services/stripeService";
import QRCode from "qrcode"
export class CreateBookingSubscriptionUseCase
  implements ICreateBookingSubscriptionUseCase
{
  private subscriptionBookingRepo: SubscriptionBookingRepository;
  private subscriptionPlanRepo: SubscriptionPlanRepository;
  private stripeService: StripeService;

  constructor() {
    this.subscriptionBookingRepo = new SubscriptionBookingRepository();
    this.subscriptionPlanRepo = new SubscriptionPlanRepository();
    this.stripeService = new StripeService();
  }

  async execute(
    data: ICreateBookingSubscriptionRequest
  ): Promise<ICreateBookingSubscriptionResponse> {
    const { vendorId, planId, date, time, domainUrl } = data;

    // ✅ 1. Find the plan in Mongo
    const plan = await this.subscriptionPlanRepo.findById(planId);
    if (!plan) throw new Error("Subscription plan not found");

    if (!plan.stripePriceId) {
      throw new Error("This plan does not have a Stripe Price ID assigned.");
    }

    // ✅ 2. Create a booking record in your DB
    const booking = await this.subscriptionBookingRepo.create({
      vendorId,
      planId: plan._id, // <-- store your Mongo plan ID here
      planName: plan.name,
      amount: plan.price,
      date,
      time,
      currency: "usd",
      status: "pending",
    });

    // ✅ 3. Create Stripe checkout session using Stripe Price ID
    const session = await this.stripeService.createSubscriptionCheckoutSession(
      plan.stripePriceId, // <-- use Stripe price ID
      domainUrl,
       booking._id.toString()
    );
const qrCodeUrl = await QRCode.toDataURL(session.checkoutUrl);
    // ✅ 4. Return booking + checkout link
    return {
      bookingId: booking._id.toString(),
      checkoutUrl: session.checkoutUrl,
       qrCode: qrCodeUrl,
    };
  }
}
