import { VerifyPaymentDTO } from "../../domain/dto/Payment/VerifyPaymentDto";
import { IStripeService } from "../../domain/interface/Payment/IStripeservice";
import { ISubscriptionPlanRepository } from "../../domain/interface/SubscriptionPlan/ISubscriptionplan";
import { ISubscriptionBookingRepository } from "../../domain/interface/SubscriptionPlan/ISubscriptionBookingRepo";
import { IVerifyPaymentUseCase } from "../../domain/interface/SubscriptionPlan/IVerifyPaymentUsecase";
import { mapSubscriptionBookingToDto } from "../../mappers/Booking/mapToSubscriptionDto";
import type { ISubscriptionBookingModel } from "../../framework/database/Models/SubscriptionBookingModel";

export class VerifyPaymentUseCase implements IVerifyPaymentUseCase {
  constructor(
    private _stripeService: IStripeService,
    private _planRepository: ISubscriptionPlanRepository,
    private _bookingRepository: ISubscriptionBookingRepository
  ) {}

  async execute(data: VerifyPaymentDTO) {
    const { sessionId, vendorId, planId } = data;
    console.log("VerifyPayment called with:", { sessionId, vendorId, planId });

    try {
      const session = await this._stripeService.retrieveSession(sessionId);
      console.log("Stripe session retrieved:", {
        id: session?.id,
        payment_status: session?.payment_status,
        customer_email: session?.customer_email,
      });

      if (!session) {
        throw new Error("Stripe session not found");
      }

      if (session.payment_status !== "paid") {
        return {
          success: false,
          message: "Payment not completed. Please complete the payment first.",
        };
      }

      let existingBooking: ISubscriptionBookingModel | null =
        await this._bookingRepository.findBySessionId(sessionId);

      if (!existingBooking) {
        console.log("Booking not found by sessionId, trying vendorId and planId");
        existingBooking =
          await this._bookingRepository.findPendingBooking(vendorId, planId);
      }

      if (!existingBooking) {
        console.log("No pending booking found, checking for active booking");
        const activeBookings =
          await this._bookingRepository.findActiveBookings(vendorId);

        const foundBooking = activeBookings.find(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (b: any) =>
            b.stripeSessionId === sessionId ||
            b.planId?.toString() === planId
        );

        if (foundBooking) {
          existingBooking = foundBooking as ISubscriptionBookingModel;

          if (existingBooking.status === "active") {
            return {
              success: true,
              message: "Payment already verified. Your subscription is active.",
              booking: mapSubscriptionBookingToDto(existingBooking),
            };
          }
        }
      }

      if (!existingBooking) {
        console.error("No booking found for:", {
          vendorId,
          planId,
          sessionId,
        });
        throw new Error(
          "Subscription booking not found. Please create a new subscription booking and try again."
        );
      }

      const plan = await this._planRepository.findById(planId);
      if (!plan) {
        throw new Error("Subscription plan not found");
      }

      const updatedBooking = await this._bookingRepository.updateBooking(
        existingBooking._id.toString(),
        {
          status: "active",
          stripeSessionId: sessionId,
          startDate: new Date(),
          endDate: new Date(
            Date.now() + plan.duration * 24 * 60 * 60 * 1000
          ),
        }
      );

      console.log("Booking updated successfully:", updatedBooking?._id);

      if (!updatedBooking) {
        throw new Error("Failed to update booking status");
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
