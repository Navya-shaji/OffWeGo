export interface TravelPost {
  id?: string;
  authorId: string;
  authorName?: string;
  authorProfilePicture?: string;
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
  metrics: {
    views: number;
    likes: number;
  };
  viewedBy?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
