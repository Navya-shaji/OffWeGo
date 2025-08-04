import type React from "react"
import { toast } from "react-toastify"
import { useAppDispatch, useAppSelector } from "@/hooks"
import { useState } from "react"
import { addSubscription } from "@/store/slice/Subscription/subscription"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { isAxiosError } from "axios"

export default function AddSubscriptionForm() {
  const dispatch = useAppDispatch()
  const { status, error } = useAppSelector((state) => state.subscription)
  const loading = status === "loading"

  const [formData, setFormData] = useState({
    name: "",
    description: "", 
    commissionRate: "",
    price: "",
    durationInDays: "",
  })
const notify = () => toast("subscription added ");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await dispatch(
        addSubscription({
          name: formData.name,
          description: formData.description, 
          commissionRate: Number(formData.commissionRate),
          price: Number(formData.price),
          durationInDays: Number(formData.durationInDays),
        }),
      ).unwrap()
notify();
    

      setFormData({
        name: "",
        description: "", 
        commissionRate: "",
        price: "",
        durationInDays: "",
      })
    } catch (error) {
      console.error("Full error adding subscription:", error)
      if (isAxiosError(error)) {
        console.error("Axios response data:", error.response?.data)
        throw new Error(error.response?.data?.error || "Failed to add subscription")
      }
      throw new Error("An unexpected error occurred while adding subscription")
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Add Subscription Plan</CardTitle>
        <CardDescription>Fill in the details for the new subscription plan.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Premium Plan"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Plan with advanced features"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="commissionRate">Commission Rate (%)</Label>
            <Input
              id="commissionRate"
              type="number"
              name="commissionRate"
              value={formData.commissionRate}
              onChange={handleChange}
              required
              min="0"
              max="100"
              placeholder="10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              placeholder="999"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="durationInDays">Duration (Days)</Label>
            <Input
              id="durationInDays"
              type="number"
              name="durationInDays"
              value={formData.durationInDays}
              onChange={handleChange}
              required
              min="1"
              placeholder="30"
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Subscription"}
          </Button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
      </CardContent>
    </Card>
  )
}
