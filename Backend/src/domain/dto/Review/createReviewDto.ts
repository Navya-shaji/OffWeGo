export interface CreateReviewDTO {
  userId: string;
  packageName: string;
  destination: string;
  description: string;
  rating: number;
  photo?: string;
}
