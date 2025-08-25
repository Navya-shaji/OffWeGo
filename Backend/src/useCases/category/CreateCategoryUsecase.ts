import { ICategoryRepository } from "../../domain/interface/category/ICategoryRepository";
import { CreateCategoryDto } from "../../domain/dto/admin/CategoryDto";
import { Category } from "../../domain/entities/categoryEntity";
import { mapToCatrgoryDto } from "../../mappers/category/categoryMappers";

export class CreateCategory{
    constructor(private _categoryRepo:ICategoryRepository){}

    async execute(data:CreateCategoryDto):Promise<Category>{
        const created=await this._categoryRepo.createCategory(data)
        return mapToCatrgoryDto(created)
    }
}