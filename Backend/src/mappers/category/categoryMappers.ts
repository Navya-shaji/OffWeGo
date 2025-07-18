import { Category } from "../../domain/entities/categoryEntity";
import { ICategoryModel } from "../../framework/database/Models/categoryModel";

export const mapToCatrgoryDto=(doc:ICategoryModel):Category=>({
   name:doc.name,
   description:doc.description,
   imageUrl:doc.imageUrl,
   type: {
    main: doc.type.main,
    sub: doc.type.sub
  },
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt
})