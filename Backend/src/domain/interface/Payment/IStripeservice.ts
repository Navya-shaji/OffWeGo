export interface IStripeService {
  createPaymentIntent(amount: number): Promise<string>;
  createSubscriptionCheckoutSession(priceId: string, domainUrl: string): Promise<{ checkoutUrl: string }>;
    retrieveSession(sessionId: string): Promise<{
    id: string;
    payment_status: string;
    customer_email?: string;
  }>;
}

