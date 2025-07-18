import { ICategoryRepository } from "../../../domain/interface/category/ICategoryRepository";
import { CategoryModel,ICategoryModel } from "../../../framework/database/Models/categoryModel";
import { CreateCategoryDto } from "../../../domain/dto/admin/CategoryDto";


export class CategoryRepository implements ICategoryRepository{
    async createCategory(data: CreateCategoryDto): Promise<ICategoryModel> {
        return await CategoryModel.create(data)
    }
    async getAllCategories(): Promise<ICategoryModel[]> {
        return CategoryModel.find()
    }
    async edit(category: ICategoryModel): Promise<void> {
        await  CategoryModel.findByIdAndUpdate(category._id,category,{new :true})
    }
    async delete(id:string):Promise<void>{
        await CategoryModel.findByIdAndDelete(id)
    }
}