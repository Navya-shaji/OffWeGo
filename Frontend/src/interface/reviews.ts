interface User {
  _id: string;
  name: string;
}

export interface IReview {
  userId: string|User;
  packageName: string;
  destination: string;
  description: string;
  rating: number;
  photo?: string;
  createdAt?: Date;
 
}
