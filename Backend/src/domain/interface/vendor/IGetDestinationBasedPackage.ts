import { Package } from "../../entities/PackageEntity";

export interface IGetDestinationBasedPackage {
  execute(destinationId: string, skip?: number, limit?: number): Promise<{
    packages: Package[];
    totalPackages: number;
  }>;
}  