import { isAxiosError } from "axios"
import axiosInstance from "@/axios/instance" 
import type { Subscription } from "@/interface/subscription" 

export const addSubscription = async (data: Subscription) => {
  try {
    console.log("Sending subscription data:", data)
    const res = await axiosInstance.post("admin/create-subscription", data)
    console.log(res)
    return res.data
  } catch (error) {
    console.error("Error adding subscription", error)
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to add subscription")
    }
    throw new Error("An unexpected error occurred while adding subscription")
  }
}

export const getSubscriptions = async () => {
  try {
    const res = await axiosInstance.get("/admin/subscriptions")
    return res.data
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to fetch subscriptions")
    }
    throw new Error("An unexpected error occurred while fetching subscriptions")
  }
}
