
export interface CreateSubscriptionDTO {
  name: string;
  description: string; 
  price: number;
  durationInDays: number;
  commissionRate: number;
}