export interface FlightDto {
  id?: string;

  airLine: string;
  price: {
    economy: number;
    premium?: number;
    business?: number;
  };
}
