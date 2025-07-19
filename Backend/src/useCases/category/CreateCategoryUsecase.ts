import { ICategoryRepository } from "../../domain/interface/category/ICategoryRepository";
import { CreateCategoryDto } from "../../domain/dto/admin/CategoryDto";
import { Category } from "../../domain/entities/categoryEntity";
import { mapToCatrgoryDto } from "../../mappers/category/categoryMappers";

export class CreateCategory{
    constructor(private categoryRepo:ICategoryRepository){}

    async execute(data:CreateCategoryDto):Promise<Category>{
        const created=await this.categoryRepo.createCategory(data)
        console.log("created one is ",created)
        return mapToCatrgoryDto(created)
    }
}