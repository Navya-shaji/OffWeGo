/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm, type FieldValues, type Path, type PathValue, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodType } from "zod";
import { useState } from "react";
import { Star } from "lucide-react";

export type FieldConfig = {
  name: string;
  label: string;
  type: "text" | "textarea" | "file" | "rating" | "number" | "url";
  placeholder?: string;
};

interface FormBuilderProps<T extends FieldValues> {
  schema: ZodType<T>;
  fields: FieldConfig[];
  onSubmit: (data: T & { rating?: number }) => Promise<void> | void;
  submitLabel?: string;
  defaultValues?: Partial<T>;
  disabled?: boolean;
}

export function FormBuilder<T extends FieldValues>({
  schema,
  fields,
  onSubmit,
  submitLabel = "Submit",
  defaultValues = {} as Partial<T>,
}: FormBuilderProps<T>) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<T>({
    resolver: zodResolver(schema as any) as Resolver<T>,
    defaultValues: defaultValues as any,
  });

  const [rating, setRating] = useState<number>(
    ((defaultValues as any)?.rating as number) || 0
  );

  const handleFormSubmit = async (data: T) => {
    await onSubmit({ ...data, rating });
    reset(defaultValues as any);
    setRating(((defaultValues as any)?.rating as number) || 0);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit as any)}
      className="max-w-lg mx-auto space-y-6 p-6"
    >
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
        Fill the Form
      </h2>

      {fields.map((field) => (
        <div key={field.name} className="flex flex-col">
          <label className="font-medium mb-2 text-gray-700">
            {field.label}
          </label>

          {field.type === "textarea" && (
            <textarea
              {...register(field.name as Path<T>)}
              placeholder={field.placeholder}
              className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-black focus:outline-none"
              rows={4}
            />
          )}

          {field.type === "file" && (
            <input
              type="file"
              accept="image/*"
              className="border border-gray-300 rounded-xl p-3 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-black file:text-white hover:file:bg-gray-800 cursor-pointer"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setValue(field.name as Path<T>, file as PathValue<T, Path<T>>);
                }
              }}
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
                {...register(field.name as Path<T>)}
                type={field.type}
                placeholder={field.placeholder}
                className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            )}

          {errors[field.name as keyof typeof errors] && (
            <span className="text-red-500 text-sm mt-1">
              {String(errors[field.name as keyof typeof errors]?.message)}
            </span>
          )}
        </div>
      ))}

      <button
        type="submit"
        className="bg-black hover:bg-gray-800 transition text-white font-medium px-6 py-3 rounded-xl w-full shadow-md mt-6"
      >
        {submitLabel}
      </button>
    </form>
  );
}