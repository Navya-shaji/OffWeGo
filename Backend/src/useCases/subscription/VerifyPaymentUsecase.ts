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
      const session = await this.stripeService.retrieveSession(sessionId);
      console.log(session)

      if (!session || session.payment_status !== "paid") {
        return {
          success: false,
          message: "Payment not verified",
        };
      }

      const plan = await this.planRepository.findById(planId);
      console.log(plan,"plan")
      if (!plan) throw new Error("Plan not found");


      const existingBooking = await this.bookingRepository.findPendingBooking(
        vendorId,
        planId
      );
      

      if (!existingBooking) {
        throw new Error("Pending booking not found");
      }

      if (!session || session.payment_status !== "paid") {
        return {
          success: false,
          message: "Payment not verified or not completed",
        };
      }

      const updatedBooking = await this.bookingRepository.updateStatus(
        existingBooking._id.toString(),
        "active"
      );
      console.log(updatedBooking,"updatedbooking")

      if (!updatedBooking) {
        throw new Error("Booking not found or could not be updated");
      }

      return {
        success: true,
        message: "Payment verified and subscription activated successfully",
        booking: mapSubscriptionBookingToDto(updatedBooking),
      };
    } catch (error) {
      console.error("VerifyPayment error:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to verify payment"
      );
    }
  }
}
