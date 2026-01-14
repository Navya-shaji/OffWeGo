export interface CategoryType {
  main: string;
  sub: string[];
}

export interface Category {
  id?: string;
  name: string;
  description?: string;
  imageUrl: string;
  type: CategoryType;
  createdAt?: Date;
  updatedAt?: Date;
}
