export interface IStripeService {
  createPaymentIntent(amount: number): Promise<string>;
  createSubscriptionCheckoutSession(priceId: string, domainUrl: string): Promise<{ url: string }>;
}
