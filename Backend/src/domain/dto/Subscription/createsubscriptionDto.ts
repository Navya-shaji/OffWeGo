export interface SubscriptionPlanDto {
  _id?: string;
  name: string;
  price: number;
  maxPackages: number;
  duration: number;
  stripePriceId: string;
  usedPackages?: number;
  isActive?: boolean;
}
