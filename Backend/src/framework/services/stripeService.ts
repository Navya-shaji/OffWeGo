import Stripe from "stripe";
import { IStripeService } from "../../domain/interface/Payment/IStripeservice"; 

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover", 
});

export class StripeService implements IStripeService {

  async createPaymentIntent(amount: number): Promise<string> {
    console.log("💰 Creating Payment Intent for:", amount);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), 
      currency: "inr",
      automatic_payment_methods: { enabled: true },
    });

    console.log("✅ PaymentIntent created:", paymentIntent.client_secret);
    return paymentIntent.client_secret!;
  }


  async createSubscriptionCheckoutSession(priceId: string, domainUrl: string): Promise<{ url: string }> {
    console.log("🌀 Creating Stripe Subscription Checkout for Price:", priceId);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceId, 
          quantity: 1,
        },
      ],
      success_url: `${domainUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domainUrl}/payment/cancel`,
    });

    console.log("✅ Checkout session created:", session.url);
    return { url: session.url! };
  }
}
