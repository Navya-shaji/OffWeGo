export interface ISubscriptionPlanModel {
  _id: string;
  name: string;
  description: string;
  price: number;
  durationInDays: number;
  commissionRate: number;
  maxPackages: number;
  features: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
