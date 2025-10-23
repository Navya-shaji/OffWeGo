export interface IReview {
  userId: string;
  packageName: string;
  destination: string;
  description: string;
  rating: number;
  photo?: string;
  createdAt?: Date;
}
