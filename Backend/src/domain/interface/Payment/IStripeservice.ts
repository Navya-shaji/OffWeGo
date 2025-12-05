export interface IStripeService {
  createPaymentIntent(amount: number): Promise<string>;

  createSubscriptionCheckoutSession(
    priceId: string,
    domainUrl: string,
    bookingId?: string
  ): Promise<{
    checkoutUrl: string;
    sessionId: string;
  }>;

  retrieveSession(
    sessionId: string
  ): Promise<{
    id: string;
    payment_status: string;
    customer_email?: string;
  }>;
}
