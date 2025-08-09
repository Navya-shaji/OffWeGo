import { ICategoryRepository } from "../../../domain/interface/category/ICategoryRepository";
import { CategoryModel,ICategoryModel } from "../../../framework/database/Models/categoryModel";
import { CreateCategoryDto } from "../../../domain/dto/admin/CategoryDto";
import { Category } from "../../../domain/entities/categoryEntity";


export class CategoryRepository implements ICategoryRepository{
    async createCategory(data: CreateCategoryDto): Promise<ICategoryModel> {
        return await CategoryModel.create(data)
    }
    async getAllCategories(skip:number,limit:number): Promise<ICategoryModel[]> {
        return CategoryModel.find().skip(skip).limit(limit)
    }
    async edit(category: ICategoryModel): Promise<void> {
        await  CategoryModel.findByIdAndUpdate(category._id,category,{new :true})
    }
    async delete(id:string):Promise<void>{
        await CategoryModel.findByIdAndDelete(id)
    }
    async countCategory(): Promise<number> {
       return await CategoryModel.countDocuments()
    }
    async searchCategory(query:string):Promise<Category[]>{
    const regex=new RegExp(query,"i")
    return CategoryModel.find({name:{$regex:regex}}).select('name description imageUrl type').limit(10).exec()
    }
}