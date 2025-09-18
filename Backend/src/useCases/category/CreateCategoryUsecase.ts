import { ICategoryRepository } from "../../domain/interface/Category/ICategoryRepository";
import { CreateCategoryDto } from "../../domain/dto/admin/CategoryDto";
import { Category } from "../../domain/entities/CategoryEntity";
import { mapToCatrgoryDto } from "../../mappers/Category/categoryMappers";

export class CreateCategory {
  constructor(private _categoryRepo: ICategoryRepository) {}

  async execute(data: CreateCategoryDto): Promise<Category> {
    const existingCategory = await this._categoryRepo.findByName(data.name);
    if (existingCategory) {
      throw new Error("Category already exists");
    }

    const created = await this._categoryRepo.createCategory(data);
    return mapToCatrgoryDto(created);
  }
}
