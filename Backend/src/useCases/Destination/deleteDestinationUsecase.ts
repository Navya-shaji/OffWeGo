import { IDeleteDestinationUseCase } from "../../domain/interface/destination/IDeleteDestinationUsecase"; 
import { DestinationModel } from "../../framework/database/Models/deestinationModel"; 

export class DeleteDestination implements IDeleteDestinationUseCase {
  async execute(id: string): Promise<{ success: boolean; message: string }> {
    console.log("Trying to delete destination with ID:", id);

    const result = await DestinationModel.findByIdAndDelete(id);

    if (!result) {
      throw new Error("Destination not found");
    }

    console.log("Destination deleted:", result._id);

    return { success: true, message: "Destination deleted successfully" };
  }
}
