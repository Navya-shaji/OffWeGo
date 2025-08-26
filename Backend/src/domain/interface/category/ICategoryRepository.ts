import { ICategoryModel } from "../../../framework/database/Models/categoryModel";

export interface ICategoryRepository {
  createCategory(data: any): Promise<ICategoryModel>;
  getAllCategories(skip: number, limit: number): Promise<ICategoryModel[]>;
  edit(category: ICategoryModel): Promise<ICategoryModel | null>;
  delete(id: string): Promise<ICategoryModel | null>;
  countCategory(): Promise<number>;
  searchCategory(query: string): Promise<ICategoryModel[]>;
  findByName(name: string): Promise<ICategoryModel | null>;
}
