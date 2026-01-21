/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateSubscriptionDto } from "../../domain/dto/Subscription/CreateSubscriptionDto";
import { IEditSubscriptionusecase } from "../../domain/interface/SubscriptionPlan/Ieditsubscriptionusecase";

import { ISubscriptionPlanRepository } from "../../domain/interface/SubscriptionPlan/ISubscriptionplan";
import { mapModelToSubscriptionDto } from "../../mappers/Subscription/mapDtoToSubscriptionModel";

export class EditSubscriptionUseCase implements IEditSubscriptionusecase {
  constructor(private _subscriptionRepository: ISubscriptionPlanRepository) { }

  async execute(
    id: string,
    updatedData: CreateSubscriptionDto
  ): Promise<CreateSubscriptionDto | null> {
    if (updatedData.name) {
      if (updatedData.name.trim() === "") {
        throw new Error("Subscription plan name cannot be empty");
      }

      const existingPlan = await this._subscriptionRepository.findByName(updatedData.name);
      if (existingPlan && existingPlan._id.toString() !== id) {
        throw new Error("Subscription plan with this name already exists");
      }
    }

    if (updatedData.features !== undefined && updatedData.features.length === 0) {
      throw new Error("Subscription plan must have at least one feature");
    }

    if ((updatedData.price !== undefined && updatedData.price < 0) ||
      (updatedData.duration !== undefined && updatedData.duration < 0)) {
      throw new Error("Price and duration cannot be negative");
    }

    const Data = await this._subscriptionRepository.update(id, updatedData as any);
    return mapModelToSubscriptionDto(Data as any);
  }
}
