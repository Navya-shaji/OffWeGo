import { CategoryDto } from "../../dto/category/categoryDto";
import { Category } from "../../entities/CategoryEntity";

export interface IEditCategoryUsecase {
  execute(id: string, updatedData: Category): Promise<CategoryDto | null>;
}
