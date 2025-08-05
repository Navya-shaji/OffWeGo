export interface CategoryType {
  id: string;
  name: string;
  description: string;
  type: {
    main: string;
    sub: string[];
  };
  imageUrl?: string;
}