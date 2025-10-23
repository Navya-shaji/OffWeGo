export interface Flight {
  id?: string;
  airLine: string;
  price: {
    economy: number;
    premium?: number;
    business?: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
