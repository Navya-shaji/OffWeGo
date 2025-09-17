import { Destination } from "../../domain/entities/DestinationEntity";
import { IDestinationRepository } from "../../domain/interface/Admin/IDestinationInterface";
import { DestinationModel } from "../../framework/database/Models/deestinationModel";

export class DeleteDestination {
  async execute(id: string): Promise<{ success: boolean; message: string }> {
    const result = await DestinationModel.findByIdAndDelete(id);

    if (!result) {
      throw new Error("Destination not found");
    }

    return { success: true, message: "Destination deleted successfully" };
  }
}
