import { CategoryDto } from "../../domain/dto/Category/CategoryDto";
import { Category } from "../../domain/entities/CategoryEntity";
import { ICategoryRepository } from "../../domain/interface/Category/ICategoryRepository";
import { IEditCategoryUsecase } from "../../domain/interface/Category/IEditCategoryUsecase";
import { CategoryModel } from "../../framework/database/Models/categoryModel";
import { mapToCatrgoryDto } from "../../mappers/Category/categoryMappers";

export class EditCategory implements IEditCategoryUsecase {
     constructor(private _categoryRepo: ICategoryRepository) {}
  async execute(id: string, updatedData: Category): Promise<CategoryDto | null> {
    const existingCategory = await this._categoryRepo.findByName(updatedData.name);
   
    if (existingCategory && !existingCategory._id) {
      throw new Error("Category already exists");
    }
    const updatedDoc = await CategoryModel.findByIdAndUpdate(id, updatedData);
    return updatedDoc ? mapToCatrgoryDto(updatedDoc) : null;
  }
}
