import { VendorDto } from "../../dto/Vendor/vendorDto";

export interface ISearchVendorUSecase {
  execute(query: string): Promise<VendorDto[]>;
}
