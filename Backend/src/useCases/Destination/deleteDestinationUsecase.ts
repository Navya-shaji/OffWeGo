import { Destination } from "../../domain/entities/DestinationEntity";
import { IDestinationRepository } from "../../domain/interface/admin/IDestinationInterface";

export class DeleteDestination{
    constructor(private destinationRepo:IDestinationRepository){}


    const result = await DestinationModel.findByIdAndDelete(id);

    if (!result) {
      throw new Error("Destination not found");
    }

    return { success: true, message: "Destination deleted successfully" };
  }
}
