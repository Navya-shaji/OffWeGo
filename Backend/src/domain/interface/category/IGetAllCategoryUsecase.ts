import { CategoryDto } from "../../dto/category/CategoryDto";

export interface IGetCategoryUsecase {
  execute(
    page: number,
    limit: number
  ): Promise<{ categories: CategoryDto[]; totalCategories: number }>;
}
