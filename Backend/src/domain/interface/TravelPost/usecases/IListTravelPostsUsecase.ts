import { TravelPostDto } from "../../../dto/TravelPost/TravelPostDto";

export interface ListTravelPostQuery {
  status?: "PENDING" | "APPROVED" | "REJECTED";
  categoryId?: string;
  destinationId?: string;
  authorId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface IListTravelPostsUsecase {
  execute(query: ListTravelPostQuery): Promise<{
    data: TravelPostDto[];
    total: number;
    page: number;
    limit: number;
  }>;
}
