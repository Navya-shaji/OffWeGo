import { SubscriptionBookingRepository } from "../../adapters/repository/Booking/subscriptionBookingRepo";
import { SubscriptionPlanRepository } from "../../adapters/repository/Subscription/subscriptionRepo";
import { IWalletRepository } from "../../domain/interface/Wallet/IWalletRepository";
import { ICreateBookingSubscriptionRequest } from "../../domain/interface/SubscriptionPlan/ICreateBookingSubscriptionRequest";
import { ICreateBookingSubscriptionResponse } from "../../domain/interface/SubscriptionPlan/ICreateBookingSubscriptionResponse";
import { ICreateBookingSubscriptionUseCase } from "../../domain/interface/SubscriptionPlan/ICreateBookingSubscriptionUsecase";
import { StripeService } from "../../framework/Services/stripeService";
import { Role } from "../../domain/constants/Roles";
import QRCode from "qrcode";

export class CreateBookingSubscriptionUseCase
  implements ICreateBookingSubscriptionUseCase
{
  constructor(
    private _subscriptionBookingRepo: SubscriptionBookingRepository,
    private _subscriptionPlanRepo: SubscriptionPlanRepository,
    private _walletRepository: IWalletRepository,
    private _stripeService: StripeService
  ) {}

  async execute(
    data: ICreateBookingSubscriptionRequest
  ): Promise<ICreateBookingSubscriptionResponse> {
    const { vendorId, planId, date, time, domainUrl } = data;

 
    const plan = await this._subscriptionPlanRepo.findById(planId);
    if (!plan) throw new Error("Subscription plan not found");
    if (!plan.stripePriceId)
      throw new Error("This plan does not have a Stripe Price ID assigned.");

  
    const booking = await this._subscriptionBookingRepo.create({
      vendorId,
      planId: plan._id,
      planName: plan.name,
      amount: plan.price,
      date,
      time,
      currency: "usd",
      status: "pending",
    });


    const session = await this._stripeService.createSubscriptionCheckoutSession(
      plan.stripePriceId,
      domainUrl,
      booking._id.toString()
    );


    const qrCodeUrl = await QRCode.toDataURL(session.checkoutUrl);

  
    const adminId = process.env.ADMIN_ID || "68666f952c4ebbe1b6989dd9";
    await this._walletRepository.updateBalance(
      adminId,
      Role.ADMIN,
      plan.price,
      "credit",
      `Subscription purchased by vendor ${vendorId}`
    );

    return {
      bookingId: booking._id.toString(),
      checkoutUrl: session.checkoutUrl,
      qrCode: qrCodeUrl,
    };
  }
}
