export interface TravelPostDto {
  id: string;
  authorId: string;
  authorName?: string;
  title: string;
  slug: string;
  categoryId: string;
  categoryName?: string;
  destinationId?: string;
  destinationName?: string;
  coverImageUrl?: string;
  galleryUrls?: string[];
  content: string;
  excerpt: string;
  tags: string[];
  tripDate?: Date;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectedReason?: string;
  createdAt: Date;
  updatedAt: Date;
  metrics: {
    views: number;
    likes: number;
  };
}
