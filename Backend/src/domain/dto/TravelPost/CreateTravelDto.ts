export interface CreateTravelPostDto {
  authorId: string;
  title: string;
  categoryId: string;
  destinationId?: string;
  coverImageUrl?: string;
  galleryUrls?: string[];
  content: string;
  excerpt?: string;
  tags: string[];
  tripDate?: Date;
}
