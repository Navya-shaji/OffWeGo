import { Category } from "../../domain/entities/categoryEntity";
import { IEditCategoryUsecase } from "../../domain/interface/category/IEditCategoryUsecase";
import { CategoryModel } from "../../framework/database/Models/categoryModel";
import { mapToCatrgoryDto } from "../../mappers/category/categoryMappers";

export class EditCategory implements IEditCategoryUsecase{
    async execute(id:string,updatedData:Category):Promise<Category | null>{
        const updatedDoc=await CategoryModel.findByIdAndUpdate(id,updatedData)
        return updatedDoc ? mapToCatrgoryDto(updatedDoc) :null
    }
}