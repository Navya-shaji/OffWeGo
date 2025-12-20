import Stripe from "stripe";
import { IStripeService } from "../../domain/interface/Payment/IStripeservice";

export class StripeService implements IStripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
     apiVersion: "2025-09-30.clover",
    });
  }

  async createPaymentIntent(amount: number): Promise<string> {
    console.log("Creating Payment Intent for amount:", amount);

    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: "inr",
        automatic_payment_methods: { enabled: true },
      });

      console.log(" PaymentIntent created:", paymentIntent.id);
      return paymentIntent.client_secret!;
    } catch (error) {
      console.error(" Error creating PaymentIntent:", error);
      throw new Error("Failed to create payment intent");
    }
  }

  async createSubscriptionCheckoutSession(
  priceId: string,
  domainUrl: string,
  bookingId?: string
): Promise<{ checkoutUrl: string; sessionId: string }> {
  console.log(" Creating Stripe Checkout session for priceId:", priceId);

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
    console.error("Error creating Checkout Session:", error);
    throw new Error("Failed to create Stripe Checkout session");
  }
}


  async retrieveSession(sessionId: string) {
    console.log("Retrieving session:", sessionId);

    const session = await this.stripe.checkout.sessions.retrieve(sessionId);

    return {
      id: session.id,
      payment_status: session.payment_status as string,
      customer_email: session.customer_details?.email ?? undefined,
    };
  }
}
