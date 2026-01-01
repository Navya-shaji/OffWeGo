export interface Subscription {
  _id?: string;
  name: string;
  price: number;
  duration: number;
  features: string[];
  stripePriceId: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
