import { Category } from "../../domain/entities/CategoryEntity";
import { ICategoryRepository } from "../../domain/interface/Category/ICategoryRepository";
import { ISearchCategoryUsecase } from "../../domain/interface/Category/IsearchcategoryUsecase";

export class SearchCategoryUsecase implements ISearchCategoryUsecase{
    constructor(private _categoryRepo:ICategoryRepository){}

    async execute(query: string): Promise<Category[]> {
        const result=this._categoryRepo.searchCategory(query)
       
        return result
    }
}