// import { SubscriptionPlanDto } from "../../domain/dto/Subscription/CreatesubscriptionDto";
// import { IEditSubscriptionusecase } from "../../domain/interface/SubscriptionPlan/Ieditsubscriptionusecase";

// import { ISubscriptionPlanRepository } from "../../domain/interface/SubscriptionPlan/ISubscriptionplan"; 
// import { mapDtoToPartialModel } from "../../mappers/Subscription/updatedMapper"; 

// export class EditSubscriptionUseCase implements IEditSubscriptionusecase {
//   constructor(private subscriptionRepository: ISubscriptionPlanRepository) {}

//   async execute(
//     id: string,
//     updatedData: SubscriptionPlanDto
//   ): Promise<SubscriptionPlanDto | null> {
//     try {
//       const updatePayload = mapDtoToPartialModel(updatedData);

//       const updatedSubscription = await this.subscriptionRepository.update(
//         id,
//         updatePayload
//       );

//       if (!updatedSubscription) return null;

    
//     } catch (error) {
//       console.error("Error updating subscription:", error);
//       throw error;
//     }
//   }
// }
