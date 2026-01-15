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
    const Data = await this._subscriptionRepository.update(id, updatedData as any);
    return mapModelToSubscriptionDto(Data as any);
  }
}
