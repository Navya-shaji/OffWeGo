import { Package } from "../../entities/packageEntity";

export interface IGetDestinationBasedPackage {
  execute(destinationId: string, skip?: number, limit?: number): Promise<{
    packages: Package[];
    totalPackages: number;
  }>;
}  