import { TravelPost } from "../../entities/TravelPostEntity";

export interface TravelPostFilter {
  status?: "PENDING" | "APPROVED" | "REJECTED";
  categoryId?: string;
  destinationId?: string;
  authorId?: string;
  search?: string;
}

export interface Pagination {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ITravelPostRepository {
  create(post: TravelPost): Promise<TravelPost>;
  update(post: TravelPost): Promise<TravelPost>;
  findById(id: string): Promise<TravelPost | null>;
  findBySlug(slug: string): Promise<TravelPost | null>;
  findByIds(ids: string[]): Promise<TravelPost[]>;
  list(filter: TravelPostFilter, pagination: Pagination): Promise<PaginatedResult<TravelPost>>;
  updateStatus(
    id: string,
    status: "PENDING" | "APPROVED" | "REJECTED",
    rejectedReason?: string
  ): Promise<TravelPost | null>;
  incrementViews(id: string): Promise<void>;
  adjustLikes(id: string, delta: number): Promise<void>;
}
