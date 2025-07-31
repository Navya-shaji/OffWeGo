export interface CreateCategoryDto {
  name: string;
  description: string;
  imageUrl: string;
  type:{
    main:string,
    sub:string
  }
}
