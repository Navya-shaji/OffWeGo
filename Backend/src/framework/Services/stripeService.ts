import Stripe from "stripe";
import { IStripeService } from "../../domain/interface/Payment/IStripeservice";

export class StripeService implements IStripeService {
  private stripe: Stripe;

  constructor() {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      console.warn("⚠️ STRIPE_SECRET_KEY is not defined in environment variables!");
    }
    this.stripe = new Stripe(secretKey || "", {
      // @ts-expect-error - stripe api version typing mismatch
      apiVersion: "2024-06-20",
    });
  }

  async createPaymentIntent(amount: number): Promise<string> {

    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: "inr",
        automatic_payment_methods: { enabled: true },
      });

      return paymentIntent.client_secret!;
    } catch (error) {
      console.error("Stripe Payment Intent Error:", error);
      throw new Error("Failed to create payment intent");
    }
  }

  async createSubscriptionCheckoutSession(
    priceId: string,
    domainUrl: string,
    bookingId?: string
  ): Promise<{ checkoutUrl: string; sessionId: string }> {

    try {
      const session = await this.stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [{ price: priceId, quantity: 1 }],
        metadata: { bookingId: bookingId ?? "N/A" },
        success_url: `${domainUrl}/vendor/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${domainUrl}/payment/cancel`,
      });

      return {
        checkoutUrl: session.url!,
        sessionId: session.id
      };
    } catch (error) {
      console.error("Stripe Checkout Error:", error);
      throw new Error("Failed to create Stripe Checkout session");
    }
  }


  async retrieveSession(sessionId: string) {

    const session = await this.stripe.checkout.sessions.retrieve(sessionId);

    return {
      id: session.id,
      payment_status: session.payment_status as string,
      customer_email: session.customer_details?.email ?? undefined,
    };
  }
}
