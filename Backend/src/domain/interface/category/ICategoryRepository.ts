import { ICategoryModel } from "../../../framework/database/Models/categoryModel";
import { CreateCategoryDto } from "../../dto/admin/CategoryDto";

export interface ICategoryRepository{
    createCategory(data:CreateCategoryDto):Promise<ICategoryModel>
    getAllCategories():Promise<ICategoryModel[]>
    edit(category:ICategoryModel):Promise<void>
    delete(id:string):Promise<void>
}