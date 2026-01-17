import { SubscriptionBookingRepository } from "../../adapters/repository/Booking/SubscriptionBookingRepo";
import { SubscriptionPlanRepository } from "../../adapters/repository/Subscription/SubscriptionRepo";
import { IWalletRepository } from "../../domain/interface/Wallet/IWalletRepository";
import { ICreateBookingSubscriptionRequest } from "../../domain/interface/SubscriptionPlan/ICreateBookingSubscriptionRequest";
import { ICreateBookingSubscriptionResponse } from "../../domain/interface/SubscriptionPlan/ICreateBookingSubscriptionResponse";
import { ICreateBookingSubscriptionUseCase } from "../../domain/interface/SubscriptionPlan/ICreateBookingSubscriptionUsecase";
import { StripeService } from "../../framework/Services/stripeService";
import { Role } from "../../domain/constants/Roles";
import QRCode from "qrcode";

export class CreateBookingSubscriptionUseCase
  implements ICreateBookingSubscriptionUseCase {
  constructor(
    private _subscriptionBookingRepo: SubscriptionBookingRepository,
    private _subscriptionPlanRepo: SubscriptionPlanRepository,
    private _walletRepository: IWalletRepository,
    private _stripeService: StripeService
  ) { }

  async execute(
    data: ICreateBookingSubscriptionRequest
  ): Promise<ICreateBookingSubscriptionResponse> {
    const { vendorId, planId, domainUrl } = data;

    await this._subscriptionBookingRepo.expireOldSubscriptions(vendorId);

    const activeSub =
      await this._subscriptionBookingRepo.getLatestSubscriptionByVendor(
        vendorId
      );

    if (activeSub) {
      throw new Error(
        `You already have an active subscription until ${activeSub.endDate}. You cannot purchase a new plan until it expires.`
      );
    }

    const plan = await this._subscriptionPlanRepo.findById(planId);
    if (!plan) throw new Error("Subscription plan not found");

    if (!plan.stripePriceId) {
      throw new Error("This plan does not have a valid Stripe Price ID.");
    }

    let booking = await this._subscriptionBookingRepo.findPendingBooking(
      vendorId,
      planId
    );

    if (!booking) {
      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + plan.duration);

      booking = await this._subscriptionBookingRepo.create({
        vendorId,
        planId: plan._id,
        planName: plan.name,
        features: plan.features,
        amount: plan.price,
        duration: plan.duration,
        currency: "inr",
        status: "pending",
        startDate,
        endDate,
      });
    }

    const session = await this._stripeService.createSubscriptionCheckoutSession(
      plan.stripePriceId,
      domainUrl,
      booking._id.toString()
    );

    await this._subscriptionBookingRepo.updateBooking(booking._id.toString(), {
      stripeSessionId: session.sessionId,
    });

    const qrCodeUrl = await QRCode.toDataURL(session.checkoutUrl);

    const adminId = process.env.ADMIN_ID || "";

    const adminWallet = await this._walletRepository.findByOwnerId(adminId);
    if (!adminWallet) {
      await this._walletRepository.createWallet({
        ownerId: adminId,
        ownerType: Role.ADMIN,
        balance: 0,
        transactions: [],
      });
    }

    await this._walletRepository.updateBalance(
      adminId,
      Role.ADMIN,
      plan.price,
      "credit",
      `Subscription purchased by vendor `
    );

    return {
      bookingId: booking._id.toString(),
      checkoutUrl: session.checkoutUrl,
      qrCode: qrCodeUrl,
    };
  }
}
