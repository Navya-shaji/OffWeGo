import { IEditSubscriptionusecase } from "../../domain/interface/SubscriptionPlan/Ieditsubscriptionusecase";
import { CreateSubscriptionDTO } from "../../domain/dto/Subscription/CreatesubscriptionDto"; 
import { ISubscriptionPlanRepository } from "../../domain/interface/SubscriptionPlan/ISubscriptionplan"; 
import { mapDtoToPartialModel } from "../../mappers/Subscription/updatedMapper"; 

export class EditSubscriptionUseCase implements IEditSubscriptionusecase {
  constructor(private subscriptionRepository: ISubscriptionPlanRepository) {}

  async execute(
    id: string,
    updatedData: CreateSubscriptionDTO
  ): Promise<CreateSubscriptionDTO | null> {
    try {
      const updatePayload = mapDtoToPartialModel(updatedData);

      const updatedSubscription = await this.subscriptionRepository.update(
        id,
        updatePayload
      );

      if (!updatedSubscription) return null;

      return {
        name: updatedSubscription.name,
        description: updatedSubscription.description,
        price: updatedSubscription.price,
        durationInDays: updatedSubscription.durationInDays,
        commissionRate: updatedSubscription.commissionRate,
      };
    } catch (error) {
      console.error("Error updating subscription:", error);
      throw error;
    }
  }
}
