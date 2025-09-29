export interface ISubscriptionPlanModel {
  _id: string;
  name: string;
  price: number;
  durationInDays: number;
  commissionRate: number;
  createdAt?: Date;
  updatedAt?: Date;
}
