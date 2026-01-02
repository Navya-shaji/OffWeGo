import { CategoryDto } from "../../dto/category/categoryDto";

export interface IGetCategoryUsecase {
  execute(
    page: number,
    limit: number
  ): Promise<{ categories: CategoryDto[]; totalCategories: number }>;
}
