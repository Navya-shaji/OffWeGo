import { IDeleteSubscriptionUsecase } from "../../domain/interface/SubscriptionPlan/IDeletesubscription";
import { ISubscriptionPlanRepository } from "../../domain/interface/SubscriptionPlan/ISubscriptionplan";

export class DeleteSubscriptionUsecase implements IDeleteSubscriptionUsecase {
  constructor(private _subscriptionRepo: ISubscriptionPlanRepository) {}
  async execute(id: string): Promise<{ success: boolean; messsege: string }> {
    const result = await this._subscriptionRepo.delete(id);
    console.log(result)
    return { success: true, messsege: "subscription deleted successfully" };
  }
}
