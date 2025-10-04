import type React from "react";
import { toast, ToastContainer } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useState } from "react";
import { addSubscription } from "@/store/slice/Subscription/subscription";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isAxiosError } from "axios";

export default function AddSubscriptionForm() {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.subscription);
  const loading = status === "loading";

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    commissionRate: "",
    price: "",
    durationInDays: "",
  });

  const notify = () => toast("Subscription added");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await dispatch(
        addSubscription({
          name: formData.name,
          commissionRate: Number(formData.commissionRate),
          price: Number(formData.price),
          durationInDays: Number(formData.durationInDays),
          description:formData.description
        })
      ).unwrap();
      notify();

      setFormData({
        name: "",
        description: "",
        commissionRate: "",
        price: "",
        durationInDays: "",
      });
    } catch (error) {
      console.error("Full error adding subscription:", error);
      if (isAxiosError(error)) {
        console.error("Axios response data:", error.response?.data);
        toast.error(error.response?.data?.error || "Failed to add subscription");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-3xl bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden">

        {/* Header */}
        <div className="bg-black text-white px-6 py-5 rounded-t-2xl">
          <h2 className="text-2xl font-bold">Add Subscription Plan</h2>
          <p className="text-sm text-gray-300 mt-1">
            Fill in the details for the new subscription plan.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <ToastContainer position="top-right" autoClose={3000} />

          <div>
            <Label htmlFor="name" className="text-sm font-semibold text-gray-700 mb-1 block">
              Plan Name <span className="text-red-500">*</span>
            </Label>
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

          <div>
            <Label htmlFor="description" className="text-sm font-semibold text-gray-700 mb-1 block">
              Description <span className="text-red-500">*</span>
            </Label>
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

          <div>
            <Label htmlFor="commissionRate" className="text-sm font-semibold text-gray-700 mb-1 block">
              Commission Rate (%) <span className="text-red-500">*</span>
            </Label>
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

          <div>
            <Label htmlFor="price" className="text-sm font-semibold text-gray-700 mb-1 block">
              Price <span className="text-red-500">*</span>
            </Label>
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

          <div>
            <Label htmlFor="durationInDays" className="text-sm font-semibold text-gray-700 mb-1 block">
              Duration (Days) <span className="text-red-500">*</span>
            </Label>
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

          <Button
            type="submit"
            className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-900 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Subscription"}
          </Button>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
      </div>
    </div>
  );
}
