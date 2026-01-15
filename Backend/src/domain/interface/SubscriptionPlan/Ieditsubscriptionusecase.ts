import { CreateSubscriptionDto } from "../../dto/Subscription/CreateSubscriptionDto";

export interface IEditSubscriptionusecase {
    execute(id: string, updatedData: CreateSubscriptionDto): Promise<CreateSubscriptionDto | null>
}