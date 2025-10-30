import { VerifyPaymentDTO } from "../../domain/dto/Payment/VerifyPaymentDto";
import { IStripeService } from "../../domain/interface/Payment/IStripeservice";
import { IVerifyPaymentUseCase } from "../../domain/interface/SubscriptionPlan/IVerifyPaymentUsecase";

export class VerifyPaymentUseCase implements IVerifyPaymentUseCase {
  constructor(private stripeService: IStripeService) {}

  async execute(data: VerifyPaymentDTO) {
    const { sessionId } = data;

    const session = await this.stripeService.retrieveSession(sessionId);

    if (!session || session.payment_status !== "paid") {
      return { success: false, message: "Payment not verified" };
    }

    const bookingId = "BOOKING_" + Date.now();

    return {
      success: true,
      message: "Payment verified and booking created successfully",
      data: { bookingId, paymentStatus: session.payment_status },
    };
  }
}
