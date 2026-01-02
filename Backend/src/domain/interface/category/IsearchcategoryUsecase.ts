import { CategoryDto } from "../../dto/category/categoryDto";

export interface ISearchCategoryUsecase {
  execute(query: string): Promise<CategoryDto[]>;
}
