import { Category } from "../../entities/categoryEntity";

export interface ISearchCategoryUsecase{
    execute(query:string):Promise<Category[]>
}