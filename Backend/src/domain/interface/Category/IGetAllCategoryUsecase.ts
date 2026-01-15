import { CategoryDto } from "../../dto/Category/CategoryDto";

export interface IGetCategoryUsecase {
  execute(
    page: number,
    limit: number
  ): Promise<{ categories: CategoryDto[]; totalCategories: number }>;
}
