import { mapToCatrgoryDto } from "../../mappers/Category/categoryMappers";
import { Category } from "../../domain/entities/CategoryEntity";
import { ICategoryRepository } from "../../domain/interface/Category/ICategoryRepository";
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