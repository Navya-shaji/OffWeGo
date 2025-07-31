import { CreateCategoryDto } from "../../dto/admin/CategoryDto";
import { Category } from "../../entities/categoryEntity";

export interface ICreateCategoryUsecase{
    execute(data:CreateCategoryDto):Promise<Category>
}