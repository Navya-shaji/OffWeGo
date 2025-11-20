import { VerifyPaymentDTO } from "../../domain/dto/Payment/VerifyPaymentDto";
import { IStripeService } from "../../domain/interface/Payment/IStripeservice";
import { ISubscriptionPlanRepository } from "../../domain/interface/SubscriptionPlan/ISubscriptionplan";
import { ISubscriptionBookingRepository } from "../../domain/interface/SubscriptionPlan/ISubscriptionBookingRepo"; 
import { IVerifyPaymentUseCase } from "../../domain/interface/SubscriptionPlan/IVerifyPaymentUsecase";
import { mapSubscriptionBookingToDto } from "../../mappers/Booking/mapToSubscriptionDto";

export class VerifyPaymentUseCase implements IVerifyPaymentUseCase {
  constructor(
    private stripeService: IStripeService,
    private planRepository: ISubscriptionPlanRepository,
    private bookingRepository: ISubscriptionBookingRepository
  ) {}

  async execute(data: VerifyPaymentDTO) {
    const { sessionId, vendorId, planId } = data;

    try {
      // 1. Verify Stripe session
      const session = await this.stripeService.retrieveSession(sessionId);

      if (!session || session.payment_status !== "paid") {
        return {
          success: false,
          message: "Payment not verified or not completed",
        };
      }

      // 2. Validate plan
      const plan = await this.planRepository.findById(planId);

      if (!plan) {
        throw new Error("Subscription plan not found");
      }

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + (plan.duration || 30));

      const booking = await this.bookingRepository.create({
        vendorId,
        planId: plan._id.toString(),
        planName: plan.name,
        amount: plan.price,
        currency: "inr",
        status: "active",
        stripeSessionId: sessionId,
        startDate,
        endDate,
        usedPackages: 0,
        maxPackages: plan.maxPackages ?? 3,
        duration: plan.duration,
      });

      return {
        success: true,
        message: "Payment verified and subscription activated successfully",
        booking: mapSubscriptionBookingToDto(booking),
      };
    } catch (error) {
      console.error("Error in VerifyPaymentUseCase:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to verify payment"
      );
    }
  }
}
