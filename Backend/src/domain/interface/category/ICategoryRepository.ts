import { ICategoryModel } from "../../../framework/database/Models/categoryModel";
import { CreateCategoryDto } from "../../dto/admin/CategoryDto";

export interface ICategoryRepository{
    createCategory(data:CreateCategoryDto):Promise<ICategoryModel>
    getAllCategories(skip:number,limit:number):Promise<ICategoryModel[]>
    edit(category:ICategoryModel):Promise<void>
    delete(id:string):Promise<void>
    countCategory():Promise<number>
}