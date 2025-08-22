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

interface FormBuilderProps<T> {
  schema: ZodSchema<T>;
  fields: FieldConfig[];
  onSubmit: (data: T & Record<string, any>) => Promise<void> | void;
  submitLabel?: string;
  defaultValues?: Record<string, any>;
}

export function FormBuilder<T>({
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
    defaultValues,
  });

  const [rating, setRating] = useState<number>(defaultValues["rating"] || 0);

  const handleFormSubmit = async (data: T) => {
    await onSubmit({ ...data, rating });

    reset(defaultValues);

    setRating(defaultValues["rating"] || 0);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name} className="flex flex-col">
          <label className="font-medium mb-1">{field.label}</label>

          {field.type === "textarea" && (
            <textarea
              {...register(field.name as any)}
              placeholder={field.placeholder}
              className="border rounded-lg p-2"
            />
          )}

          {field.type === "file" && (
            <input
              type="file"
              accept="image/*"
              className="border rounded-lg p-2"
              onChange={(e) =>
                setValue(field.name as any, e.target.files?.[0] || null)
              }
            />
          )}

          {field.type === "rating" && (
            <div className="flex space-x-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 cursor-pointer ${
                    star <= rating
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-400"
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
                {...register(field.name as string)}
                type={field.type}
                placeholder={field.placeholder}
                className="border rounded-lg p-2"
              />
            )}

          {errors[field.name as keyof T] && (
            <span className="text-red-500 text-sm">
              {String(errors[field.name as keyof T]?.message)}
            </span>
          )}
        </div>
      ))}

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
      >
        {submitLabel}
      </button>
    </form>
  );
}
