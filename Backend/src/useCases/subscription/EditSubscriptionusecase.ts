import { SubscriptionPlanDto } from "../../domain/dto/Subscription/CreatesubscriptionDto";
import { IEditSubscriptionusecase } from "../../domain/interface/SubscriptionPlan/Ieditsubscriptionusecase";

import { ISubscriptionPlanRepository } from "../../domain/interface/SubscriptionPlan/ISubscriptionplan";
import { mapModelToSubscriptionDto } from "../../mappers/Subscription/mapDtoToSubscriptionModel";

export class EditSubscriptionUseCase implements IEditSubscriptionusecase {
  constructor(private _subscriptionRepository: ISubscriptionPlanRepository) {}

  async execute(
    id: string,
    updatedData: SubscriptionPlanDto
  ): Promise<SubscriptionPlanDto | null> {
    const Data = await this._subscriptionRepository.update(id, updatedData);
    return mapModelToSubscriptionDto(Data);
  }
}
