import { Category } from "../../domain/entities/categoryEntity";
import { ICategoryRepository } from "../../domain/interface/category/ICategoryRepository";
import { IEditCategoryUsecase } from "../../domain/interface/category/IEditCategoryUsecase";
import { CategoryModel } from "../../framework/database/Models/categoryModel";
import { mapToCatrgoryDto } from "../../mappers/category/categoryMappers";

export class EditCategory implements IEditCategoryUsecase {
     constructor(private _categoryRepo: ICategoryRepository) {}
  async execute(id: string, updatedData: Category): Promise<Category | null> {
    const existingCategory = await this._categoryRepo.findByName(updatedData.name);
    if (existingCategory) {
      throw new Error("Category already exists");
    }
    const updatedDoc = await CategoryModel.findByIdAndUpdate(id, updatedData);
    return updatedDoc ? mapToCatrgoryDto(updatedDoc) : null;
  }
}
