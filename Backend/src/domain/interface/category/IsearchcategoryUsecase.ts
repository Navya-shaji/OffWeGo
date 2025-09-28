import { CategoryDto } from "../../dto/category/CategoryDto";

export interface ISearchCategoryUsecase {
  execute(query: string): Promise<CategoryDto[]>;
}
