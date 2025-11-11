import { VerifyPaymentDTO } from "../../domain/dto/Payment/VerifyPaymentDto";
import { IStripeService } from "../../domain/interface/Payment/IStripeservice";
import { ISubscriptionPlanRepository } from "../../domain/interface/SubscriptionPlan/ISubscriptionplan";
import { IVerifyPaymentUseCase } from "../../domain/interface/SubscriptionPlan/IVerifyPaymentUsecase";


export class VerifyPaymentUseCase implements IVerifyPaymentUseCase {
  constructor(
    private stripeService: IStripeService,
    private subscriptionRepository: ISubscriptionPlanRepository,
  ) {}

  async execute(data: VerifyPaymentDTO) {
    const { sessionId, vendorId, planId } = data;

    try {
      console.log("Retrieving Stripe session...", sessionId);

      // Retrieve the session from Stripe
      const session = await this.stripeService.retrieveSession(sessionId);

      if (!session || session.payment_status !== "paid") {
        return { 
          success: false, 
          message: "Payment not verified or not completed" 
        };
      }

      console.log("Payment verified, creating subscription booking...");

      // Get the subscription plan details
      const plan = await this.subscriptionRepository.findById(planId);

      if (!plan) {
        throw new Error("Subscription plan not found");
      }

      // Calculate subscription dates
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + plan.duration);

      // Create the subscription booking
      const booking = await this.subscriptionRepository.create({
        vendorId,
        planId,
        planName: plan.name,
   
        stripeSessionId: sessionId,
        status: "active",
        startDate,
        endDate,
        packageLimit: plan.packageLimit,
        usedPackages: 0,
        duration: plan.duration,
     
      });

      console.log("Subscription booking created:", booking);

      return {
        success: true,
        message: "Payment verified and subscription activated successfully",
        booking: {
          id: booking._id || booking.id,
          vendorId: booking.vendorId,
          planName: booking.planName,
          amount: booking.amount,
          status: booking.status,
          startDate: booking.startDate,
          endDate: booking.endDate,
          packageLimit: booking.packageLimit,
          paymentIntentId: booking.paymentIntentId,
        },
      };
    } catch (error) {
      console.error("Error in VerifyPaymentUseCase:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to verify payment"
      );
    }
  }
}