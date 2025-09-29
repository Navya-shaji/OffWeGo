import { CategoryType } from "../../entities/CategoryEntity";

export interface CategoryDto {
  id?: string;          
  name: string;
  description?: string;
  imageUrl: string;
  type: CategoryType;
}
