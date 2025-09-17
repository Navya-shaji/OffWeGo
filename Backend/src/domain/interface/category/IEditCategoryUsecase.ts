import { Category } from "../../entities/CategoryEntity";


export interface IEditCategoryUsecase{
    execute(id:string,updatedData:Category):Promise<Category|null>
}