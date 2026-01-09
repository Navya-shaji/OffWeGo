import { VendorDto } from "../../dto/Vendor/VendorDto";

export interface ISearchVendorUSecase {
  execute(query: string): Promise<VendorDto[]>;
}
