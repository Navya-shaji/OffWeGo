import { Category } from "../../entities/CategoryEntity";

export interface IGetCategoryUsecase{
    execute(page:number,limit:number):Promise<{categories:Category[],totalCategories:number}>
}