import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodSchema } from "zod";
import { useState } from "react";
import { Star } from "lucide-react";

export type FieldConfig = {
  name: string;
  label: string;
  type: "text" | "textarea" | "file" | "rating" | "number" | "url";
  placeholder?: string;
};

interface FormBuilderProps<T extends Record<string, unknown>> {
  schema: ZodSchema<T>;
  fields: FieldConfig[];
  onSubmit: (data: T & { rating?: number }) => Promise<void> | void;
  submitLabel?: string;
  defaultValues?: Partial<T>;
}

export function FormBuilder<T extends Record<string, unknown>>({
  schema,
  fields,
  onSubmit,
  submitLabel = "Submit",
  defaultValues = {},
}: FormBuilderProps<T>) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as T,
  });

  const [rating, setRating] = useState<number>(
    (defaultValues as Record<string, unknown>)["rating"] as number || 0
  );

  const handleFormSubmit = async (data: T) => {
    await onSubmit({ ...data, rating });
    reset(defaultValues as T);
    setRating((defaultValues as Record<string, unknown>)["rating"] as number || 0);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="max-w-lg mx-auto"
    >
      <h2 className="text-xl font-semibold text-gray-800 text-center">
        Fill the Form
      </h2>

      {fields.map((field) => (
        <div key={field.name} className="flex flex-col">
          <label className="font-medium mb-2 text-gray-700">
            {field.label}
          </label>

          {field.type === "textarea" && (
            <textarea
              {...register(field.name as keyof T & string)}
              placeholder={field.placeholder}
              className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-black focus:outline-none"
              rows={4}
            />
          )}

          {field.type === "file" && (
            <input
              type="file"
              accept="image/*"
              className="border border-gray-300 rounded-xl p-3 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-black file:text-white hover:file:bg-black cursor-pointer"
              onChange={(e) =>
                setValue(field.name as keyof T & string, e.target.files?.[0] as T[keyof T])
              }
            />
          )}

          {field.type === "rating" && (
            <div className="flex space-x-2 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-7 h-7 cursor-pointer transition ${
                    star <= rating
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300 hover:text-yellow-400"
                  }`}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
          )}

          {field.type !== "textarea" &&
            field.type !== "file" &&
            field.type !== "rating" && (
              <input
                {...register(field.name as keyof T & string)}
                type={field.type}
                placeholder={field.placeholder}
                className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            )}

          {errors[field.name as keyof T] && (
            <span className="text-red-500 text-sm mt-1">
              {String(errors[field.name as keyof T]?.message)}
            </span>
          )}
        </div>
      ))}

      <button
        type="submit"
        className="bg-black transition text-white font-medium px-6 py-3 rounded-xl w-full shadow-md"
      >
        {submitLabel}
      </button>
    </form>
  );
}