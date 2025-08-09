import { ICategoryModel } from "../../../framework/database/Models/categoryModel";
import { CreateCategoryDto } from "../../dto/admin/CategoryDto";
import { Category } from "../../entities/categoryEntity";

export interface ICategoryRepository{
    createCategory(data:CreateCategoryDto):Promise<ICategoryModel>
    getAllCategories(skip:number,limit:number):Promise<ICategoryModel[]>
    edit(category:ICategoryModel):Promise<void>
    delete(id:string):Promise<void>
    countCategory():Promise<number>
    searchCategory(query:string):Promise<Category[]>
}