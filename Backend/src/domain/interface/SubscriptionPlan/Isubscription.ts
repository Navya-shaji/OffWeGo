export interface ISubscriptionPlanModel {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  commissionRate: number;
  maxPackages: number;
  
  createdAt?: Date;
  updatedAt?: Date;
}
