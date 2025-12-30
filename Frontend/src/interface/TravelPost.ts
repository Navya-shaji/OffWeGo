export interface TravelPost {
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
  tripDate?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectedReason?: string;
  createdAt: string;
  updatedAt: string;
  metrics: {
    views: number;
    likes: number;
  };
}

import type { CategoryType } from "./categoryInterface";
import type { DestinationInterface } from "./destinationInterface";

export interface CreateTravelPostPayload {
  title: string;
  categoryId: string;
  destinationId?: string;
  coverImageUrl?: string;
  galleryUrls?: string[];
  content: string;
  excerpt?: string;
  tags: string[];
  tripDate?: string;
}

export interface TravelPostListResponse {
  data: TravelPost[];
  total: number;
  page: number;
  limit: number;
}

export interface TravelPostFilters {
  categories: CategoryType[];
  destinations: DestinationInterface[];
  totalCategories: number;
  totalDestinations: number;
}
