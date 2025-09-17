import { mapToCatrgoryDto } from "../../mappers/category/categoryMappers";
import { Category } from "../../domain/entities/categoryEntity";
import { ICategoryRepository } from "../../domain/interface/category/ICategoryRepository";
export class GetAllCategories{
    constructor(private _categoryRepo:ICategoryRepository){}

    async execute(page:number,limit:number):Promise<{categories:Category[],totalCategories:number}>{
        const skip=(page-1)*limit;
        const category=await this._categoryRepo.getAllCategories(skip,limit)
        const totalCategories=await this._categoryRepo.countCategory()
        return{
            categories:category.map(mapToCatrgoryDto),
            totalCategories:totalCategories
        }
    }
}