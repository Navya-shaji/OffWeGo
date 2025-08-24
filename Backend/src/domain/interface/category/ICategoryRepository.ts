import { ICategoryModel } from "../../../framework/database/Models/categoryModel";
import { CreateCategoryDto } from "../../dto/admin/CategoryDto";
import { Category } from "../../entities/categoryEntity";

export interface ICategoryRepository {
  createCategory(data: any): Promise<ICategoryModel>;
  getAllCategories(skip: number, limit: number): Promise<ICategoryModel[]>;
  edit(category: ICategoryModel): Promise<ICategoryModel | null>; 
  delete(id: string): Promise<ICategoryModel | null>;             
  countCategory(): Promise<number>;
  searchCategory(query: string): Promise<ICategoryModel[]>;
}