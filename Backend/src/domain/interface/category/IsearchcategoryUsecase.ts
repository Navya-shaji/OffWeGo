import { CategoryDto } from "../../dto/Category/CategoryDto";

export interface ISearchCategoryUsecase {
  execute(query: string): Promise<CategoryDto[]>;
}
