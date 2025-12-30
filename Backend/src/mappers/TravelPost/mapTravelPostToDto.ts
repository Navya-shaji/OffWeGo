import { TravelPost } from "../../domain/entities/TravelPostEntity";
import { TravelPostDto } from "../../domain/dto/TravelPost/TravelPostDto";

export const mapTravelPostToDto = (post: TravelPost): TravelPostDto => ({
  id: post.id!,
  authorId: post.authorId,
  title: post.title,
  slug: post.slug,
  categoryId: post.categoryId,
  destinationId: post.destinationId,
  coverImageUrl: post.coverImageUrl,
  galleryUrls: post.galleryUrls ?? [],
  content: post.content,
  excerpt: post.excerpt,
  tags: post.tags,
  tripDate: post.tripDate,
  status: post.status,
  rejectedReason: post.rejectedReason,
  createdAt: post.createdAt!,
  updatedAt: post.updatedAt!,
  metrics: post.metrics,
});

export const mapTravelPostsToDto = (posts: TravelPost[]): TravelPostDto[] =>
  posts.map(mapTravelPostToDto);
