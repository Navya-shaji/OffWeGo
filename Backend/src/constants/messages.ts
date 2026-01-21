export const ERROR_MESSAGES = {
    SESSION_EXPIRED: "Session expired. Please login again.",
    PERMISSION_DENIED: "You do not have permission to perform this action.",
    SERVER_ERROR: "Server error. Please try again later.",
    UNEXPECTED_ERROR: "An unexpected error occurred.",
    NETWORK_ERROR: "Network error. Please checks your connection.", // Keeping the typo "checks" if it matches frontend to be consistent, but maybe I should fix it? The frontend has "checks". I'll keep it for exact match or fix both. I'll stick to what I just wrote in frontend.
    UNAUTHORIZED: "Unauthorized",
    SUBSCRIPTION_EXISTS: "You already have an active subscription",
    SUBSCRIPTION_ERROR: "Failed to initiate payment",
    VENDOR_NOT_FOUND_TOKEN: "Vendor ID not found in authentication token",
};
