import { Category } from "../../entities/categoryEntity";


export interface IEditCategoryUsecase{
    execute(id:string,updatedData:Category):Promise<Category|null>
}