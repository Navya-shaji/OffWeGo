import { Category } from "../../entities/categoryEntity";

export interface IGetCategoryUsecase{
    execute(page:number,limit:number):Promise<{categories:Category[],totalCategories:number}>
}