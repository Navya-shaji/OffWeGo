// import { CreateSubscriptionDTO } from "../../domain/dto/Subscription/createsubscriptionDto";
// import { IEditSubscriptionusecase } from "../../domain/interface/SubscriptionPlan/Ieditsubscriptionusecase";
// import { ISubscriptionPlanRepository } from "../../domain/interface/SubscriptionPlan/ISubscriptionplan";
// import { mapDtoToSubscriptionModel } from "../../mappers/subscription/mapDtoToSubscriptionModel";
// import {  mapDtoToPartialModel } from "../../mappers/subscription/updatedMapper";

// export class EditSubscriptionUsecase implements IEditSubscriptionusecase {
//   constructor(private _subscriptionRepo: ISubscriptionPlanRepository) {}

//   async execute(
//     id: string,
//     updatedData: CreateSubscriptionDTO
//   ): Promise<CreateSubscriptionDTO | null> {
//     // Map DTO → partial Mongoose model
//     const updateObj = mapDtoToSubscriptionModel(updatedData);

//     // Perform the update in the repository
//     const updatedDoc = await this._subscriptionRepo.update(id, updateObj);

//     // Map updated Mongoose doc → DTO
//     return updatedDoc ? mapDtoToPartialModel(updatedDoc) : null;
//   }
// }
