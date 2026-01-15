import { CreateCategoryDto } from "../../dto/Admin/CategoryDto";
import { Category } from "../../entities/CategoryEntity";

export interface ICreateCategoryUsecase {
  execute(data: CreateCategoryDto): Promise<Category>;
}
