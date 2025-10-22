import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, ToastContainer } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  addSubscriptionStart,
  addSubscriptionSuccess,
  addSubscriptionFailure,
} from "@/store/slice/Subscription/subscription";
import * as subscriptionService from "@/services/subscription/subscriptionservice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SubscriptionSchema,
  type SubscriptionFormData,
} from "@/Types/Admin/Subscription/subscrriptionSchema";

export default function AddSubscriptionForm() {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.subscription);
  const loading = status === "loading";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubscriptionFormData>({
    resolver: zodResolver(SubscriptionSchema),
  });

  const notify = () => toast.success("Subscription added successfully!");
console.log("Component loaded ✅");
 const onSubmit = async (data: SubscriptionFormData) => {
  console.log("Form submitted with data:", data);
  
  try {
    dispatch(addSubscriptionStart());
    console.log("Dispatched start action");

    const response = await subscriptionService.addSubscription({
      name: data.name,
      price: data.price,
      maxPackages: data.maxPackages,
      duration: data.duration, // Make sure this matches your service expectation
    });
    
    console.log("Response received:", response);

    dispatch(addSubscriptionSuccess(response));
    notify();
    reset();
  } catch (err: unknown) {
    console.error("Error adding subscription:", err);
    dispatch(addSubscriptionFailure("Failed to add subscription"));
    toast.error("Failed to add subscription");
  }
};

  return (
    <div className="flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-3xl bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden">
        <div className="bg-black text-white px-6 py-5 rounded-t-2xl">
          <h2 className="text-2xl font-bold">Add Subscription Plan</h2>
          <p className="text-sm text-gray-300 mt-1">
            Fill in the details for the new subscription plan.
          </p>
        </div>

 <form 
  onSubmit={(e) => {
    console.log("Form onSubmit triggered");
    e.preventDefault(); // Add this to prevent default behavior
    handleSubmit(
      (data) => {
        console.log("✅ Validation passed, data:", data);
        onSubmit(data);
      },
      (errors) => {
        console.log("❌ Validation errors:", errors);
      }
    )(e);
  }} 
  className="p-6 space-y-5"
>
          <ToastContainer position="top-right" autoClose={3000} />

          <div>
            <Label
              htmlFor="name"
              className="text-sm font-semibold text-gray-700 mb-1 block"
            >
              Plan Name
            </Label>
            <Input
              id="name"
              type="text"
              {...register("name")}
              placeholder="Premium Plan"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label
              htmlFor="price"
              className="text-sm font-semibold text-gray-700 mb-1 block"
            >
              Price *
            </Label>
            <Input
              id="price"
              type="number"
              {...register("price", { valueAsNumber: true })}
              placeholder="999"
            />
            {errors.price && (
              <p className="text-red-500 text-sm">{errors.price.message}</p>
            )}
          </div>

          <div>
            <Label
              htmlFor="durationInDays"
              className="text-sm font-semibold text-gray-700 mb-1 block"
            >
              Duration (Days)
            </Label>
            <Input
              id="durationInDays"
              type="number"
              {...register("duration", { valueAsNumber: true })}
              placeholder="30"
            />
            {errors.duration && (
              <p className="text-red-500 text-sm">
                {errors.duration.message}
              </p>
            )}
          </div>

          <div>
            <Label
              htmlFor="maxPackages"
              className="text-sm font-semibold text-gray-700 mb-1 block"
            >
              Max Packages
            </Label>
            <Input
              id="maxPackages"
              type="number"
              {...register("maxPackages", { valueAsNumber: true })}
              placeholder="3"
            />
            {errors.maxPackages && (
              <p className="text-red-500 text-sm">
                {errors.maxPackages.message}
              </p>
            )}
          </div>

       

          <Button
              type="submit"
  onClick={() => console.log("Button clicked!")}
            className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-900 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Subscription"}
          </Button>

          {error && (
            <p className="text-red-500 text-sm text-center mt-2">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
}
