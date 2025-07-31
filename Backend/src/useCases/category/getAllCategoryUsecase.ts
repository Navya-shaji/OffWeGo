import { Category } from "../../domain/entities/categoryEntity";
import { ICategoryRepository } from "../../domain/interface/category/ICategoryRepository";
import { mapToCatrgoryDto } from "../../mappers/category/categoryMappers";

export class GetAllCategories{
    constructor(private categoryRepo:ICategoryRepository){}

    async execute():Promise<Category[]>{
        const category=await this.categoryRepo.getAllCategories()
        return category.map(mapToCatrgoryDto)
    }
}