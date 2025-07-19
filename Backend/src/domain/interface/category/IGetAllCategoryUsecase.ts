import { Category } from "../../entities/categoryEntity";

export interface IGetCategoryUsecase{
    execute():Promise<Category[]|null>
}