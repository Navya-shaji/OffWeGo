import { CategoryDto } from "../../dto/Category/CategoryDto";
import { Category } from "../../entities/CategoryEntity";

export interface IEditCategoryUsecase {
  execute(id: string, updatedData: Category): Promise<CategoryDto | null>;
}
