import { SubscriptionPlanDto } from "../../domain/dto/Subscription/CreatesubscriptionDto";
import { ICreateSubscriptionPlanUseCase } from "../../domain/interface/SubscriptionPlan/ICreateUsecase";
import { ISubscriptionPlanRepository } from "../../domain/interface/SubscriptionPlan/ISubscriptionplan";
import { mapModelToSubscriptionDto } from "../../mappers/Subscription/mapDtoToSubscriptionModel";



export class createSubscriptionusecase implements ICreateSubscriptionPlanUseCase{
  constructor(private _subscriptionRepo:ISubscriptionPlanRepository){}

  async execute(data: SubscriptionPlanDto): Promise<SubscriptionPlanDto> {
    const created=await this._subscriptionRepo.create(data)
    return mapModelToSubscriptionDto(created)
  }
}