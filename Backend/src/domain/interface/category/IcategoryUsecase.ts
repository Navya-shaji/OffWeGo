import { CreateCategoryDto } from "../../dto/admin/CategoryDto";
import { Category } from "../../entities/CategoryEntity";

export interface ICreateCategoryUsecase {
  execute(data: CreateCategoryDto): Promise<Category>;
}
