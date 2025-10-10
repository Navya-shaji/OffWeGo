import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, ToastContainer } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { addSubscription } from "@/store/slice/Subscription/subscription";
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

  const notify = () => toast("Subscription added");

  const onSubmit = async (data: SubscriptionFormData) => {
    try {
      await dispatch(
        addSubscription({
          name: data.name,
          description: data.description,
          commissionRate: data.commissionRate,
          price: data.price,
          durationInDays: data.durationInDays,
        })
      ).unwrap();

      notify();
      reset();
    } catch (err) {
      console.error("Error adding subscription:", err);
      toast.error("Failed to add subscription");
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
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          <ToastContainer position="top-right" autoClose={3000} />

          <div>
            <Label
              htmlFor="name"
              className="text-sm font-semibold text-gray-700 mb-1 block"
            >
              Plan Name <span className="text-red-500"></span>
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
              htmlFor="description"
              className="text-sm font-semibold text-gray-700 mb-1 block"
            >
              Description <span className="text-red-500"></span>
            </Label>
            <Input
              id="description"
              type="text"
              {...register("description")}
              placeholder="Plan with advanced features"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <Label
              htmlFor="commissionRate"
              className="text-sm font-semibold text-gray-700 mb-1 block"
            >
              Commission Rate (%) <span className="text-red-500"></span>
            </Label>
            <Input
              id="commissionRate"
              type="number"
              {...register("commissionRate", { valueAsNumber: true })}
              placeholder="10"
            />
            {errors.commissionRate && (
              <p className="text-red-500 text-sm">
                {errors.commissionRate.message}
              </p>
            )}
          </div>

          <div>
            <Label
              htmlFor="price"
              className="text-sm font-semibold text-gray-700 mb-1 block"
            >
              Price <span className="text-red-500">*</span>
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
              Duration (Days) <span className="text-red-500"></span>
            </Label>
            <Input
              id="durationInDays"
              type="number"
              {...register("durationInDays", { valueAsNumber: true })}
              placeholder="30"
            />
            {errors.durationInDays && (
              <p className="text-red-500 text-sm">
                {errors.durationInDays.message}
              </p>
            )}
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
