import { mapToCatrgoryDto } from "../../mappers/Category/categoryMappers";
import { ICategoryRepository } from "../../domain/interface/Category/ICategoryRepository";
import { CategoryDto } from "../../domain/dto/category/categoryDto";
export class GetAllCategories {
    constructor(private _categoryRepo:ICategoryRepository){}

    async execute(page:number,limit:number):Promise<{categories:CategoryDto[],totalCategories:number}>{
        const skip=(page-1)*limit;
        const category=await this._categoryRepo.getAllCategories(skip,limit)
        const totalCategories=await this._categoryRepo.countCategory()
        return{
            categories:category.map(mapToCatrgoryDto),
            totalCategories:totalCategories
        }
    }
}