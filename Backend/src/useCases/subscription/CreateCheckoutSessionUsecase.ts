import { CreateCheckoutSessionDTO } from "../../domain/dto/Subscription/createCheckoutSessionDto";
import { IStripeService } from "../../domain/interface/Payment/IStripeservice";
import { ICreateCheckoutSessionUseCase } from "../../domain/interface/SubscriptionPlan/ICreateCheckoutSessionUsecase";

export class CreateCheckoutSessionUseCase implements ICreateCheckoutSessionUseCase {
  constructor(private stripeService: IStripeService) {}

  async execute(data: CreateCheckoutSessionDTO) {
    const { planName, planId,  domainUrl } = data;


    const session = await this.stripeService.createSubscriptionCheckoutSession(
      planId,
      domainUrl,
    );

    return {
      success: true,
      url: session.checkoutUrl,
      message: `Checkout session created for plan: ${planName}`,
    };
  }
}
