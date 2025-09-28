// import { Request, Response } from "express";
// import { IGetPackageUsecase } from "../../../domain/interface/Vendor/IGetPackageUsecase";

// export class PackageController {
//   constructor(private getPackageUsecase: IGetPackageUsecase) {}

//   async getPackages(req: Request, res: Response): Promise<void> {
 
//     try {
//       const destination = req.query.destination as string | undefined;
//       const packages = await this.getPackageUsecase.execute(destination);
//       res.status(200).json(packages);
//     } catch (error) {
//       console.error("Error fetching packages:", error);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   }
// }
