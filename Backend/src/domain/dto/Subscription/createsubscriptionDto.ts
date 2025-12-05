export interface SubscriptionPlanDto {
  _id?: string;
  name: string;
  price: number;
  duration: number;            
  features: string[];         
  stripePriceId: string;
  isActive?: boolean;
}
