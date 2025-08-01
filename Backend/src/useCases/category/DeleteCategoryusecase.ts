import { IDeleteCategorynUseCase } from "../../domain/interface/category/IDeleteCategory";
import { CategoryModel } from "../../framework/database/Models/categoryModel";

export class DeleteCategory implements IDeleteCategorynUseCase{
    async execute(id: string): Promise<{ success: boolean; message: string; }> {
        const result=await CategoryModel.findByIdAndDelete(id)

        if(!result){
            throw new Error("Category not found")
        }
        return {success:true,message:"Category deleted successfully"}
    }
}