import {model,Document,ObjectId} from "mongoose"
import { Category } from "../../../domain/entities/CategoryEntity"
import { categorySchema } from "../Schema/categorySchema"

export interface ICategoryModel extends Omit<Category,"id">,Document{
    _id:ObjectId
}

export const CategoryModel=model<ICategoryModel>("category",categorySchema)