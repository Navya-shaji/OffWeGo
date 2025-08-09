import { Category } from "../../domain/entities/categoryEntity";
import { ICategoryRepository } from "../../domain/interface/category/ICategoryRepository";
import { ISearchCategoryUsecase } from "../../domain/interface/category/IsearchcategoryUsecase";

export class SearchCategoryUsecase implements ISearchCategoryUsecase{
    constructor(private categoryRepo:ICategoryRepository){}

    async execute(query: string): Promise<Category[]> {
        const result=this.categoryRepo.searchCategory(query)
        console.log(result)
        return result
    }
}