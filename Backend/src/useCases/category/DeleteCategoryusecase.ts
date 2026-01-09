import { IDeleteCategorynUseCase } from "../../domain/interface/Category/IDeleteCategory";
import { CategoryModel } from "../../framework/database/Models/categoryModel";

export class DeleteCategory implements IDeleteCategorynUseCase{
    async execute(id: string): Promise<{ success: boolean; message: string; }> {
        console.log("Attempting to delete category with ID:", id);
        
        if (!id) {
            throw new Error("Category ID is required");
        }

        try {
            const result = await CategoryModel.findByIdAndDelete(id);
            console.log("Delete result:", result);

            if(!result){
                throw new Error("Category not found")
            }
            return {success:true,message:"Category deleted successfully"}
        } catch (dbError) {
            console.error("Database error during deletion:", dbError);
            throw dbError;
        }
    }
}