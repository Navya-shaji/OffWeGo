
import { DestinationModel } from "../../framework/database/Models/deestinationModel";

export class EditDestination {
  async execute(id: string, data: any) {
    const updated = await DestinationModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      throw new Error("Destination not found");
    }

    return updated;
  }
}