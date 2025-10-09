
export interface CreateSubscriptionDTO {
  _id?:string
  name: string;
  description: string; 
  price: number;
  durationInDays: number;
  commissionRate: number;
}