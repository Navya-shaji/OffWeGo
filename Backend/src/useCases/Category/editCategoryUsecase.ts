import { CategoryDto } from "../../domain/dto/Category/CategoryDto";
import { Category } from "../../domain/entities/CategoryEntity";
import { ICategoryRepository } from "../../domain/interface/Category/ICategoryRepository";
import { IEditCategoryUsecase } from "../../domain/interface/Category/IEditCategoryUsecase";
import { CategoryModel } from "../../framework/database/Models/categoryModel";
import { mapToCatrgoryDto } from "../../mappers/Category/categoryMappers";

export class EditCategory implements IEditCategoryUsecase {
  constructor(private _categoryRepo: ICategoryRepository) { }
  async execute(id: string, updatedData: Category): Promise<CategoryDto | null> {
    if (updatedData.name) {
      if (updatedData.name.trim() === "") {
        throw new Error("Category name cannot be empty");
      }
      const existingCategory = await this._categoryRepo.findByName(updatedData.name);
      if (existingCategory && existingCategory._id.toString() !== id) {
        throw new Error("Category with this name already exists");
      }
    }

    // Since validation passed or name didn't change/wasn't provided (if partial update allowed), proceed.
    // However, updatedData is 'Category', we need 'ICategoryModel'. 
    // The repository 'edit' method expects 'ICategoryModel' which includes _id.
    // Let's construct a partial object or use the model directly if repository doesn't support partial update by ID easily

    // Going by the pattern in this file, let's fix the direct model usage to use repo if possible, 
    // but the repo.edit takes ICategoryModel (full doc). 
    // Let's stick to fixing the validation logic first as requested, but keep the update logic working.
    // The previous code used CategoryModel.findByIdAndUpdate(id, updatedData). 
    // This implies updatedData is a partial update object.

    const updatedDoc = await CategoryModel.findByIdAndUpdate(id, updatedData, { new: true });
    return updatedDoc ? mapToCatrgoryDto(updatedDoc) : null;
  }
}
