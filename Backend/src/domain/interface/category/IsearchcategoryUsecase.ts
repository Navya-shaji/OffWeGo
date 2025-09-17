import { Category } from "../../entities/CategoryEntity";

export interface ISearchCategoryUsecase{
    execute(query:string):Promise<Category[]>
}