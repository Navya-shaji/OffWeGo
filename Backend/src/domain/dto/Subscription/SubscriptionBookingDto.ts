export interface SubscriptionBookingDto {
    _id: string;
    vendorId: string;
    vendorName?: string;
    vendorEmail?: string;
    planId: string;
    planName: string;
    amount: number;
    currency: string;
    status: "pending" | "active" | "expired";
    duration: number;
    features: string[];
    startDate?: string;
    endDate?: string;
    createdAt: string;
    updatedAt: string;
    stripeSubscriptionId?: string;
    domainUrl?: string;
}
