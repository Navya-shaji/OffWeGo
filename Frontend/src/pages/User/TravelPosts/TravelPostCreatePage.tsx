import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
  createTravelPost,
  fetchTravelPostFilters,
} from "@/services/TravelPost/TravelPostService";
import type { TravelPostFilters } from "@/interface/TravelPost";
import { uploadToCloudinary } from "@/utilities/cloudinaryUpload";
import Header from "@/components/home/navbar/Header";

const travelPostSchema = z.object({
  title: z.string().min(5, "Add a descriptive title (min. 5 characters)").max(120),
  categoryId: z.string().min(1, "Pick a category"),
  destinationId: z.string().optional(),
  content: z.string().min(80, "Share at least a short narrative (min. 80 characters)"),
  excerpt: z
    .string()
    .max(200, "Excerpt should be under 200 characters")
    .optional()
    .or(z.literal("")),
  tags: z.string().optional(),
  tripDate: z.string().optional(),
});

type TravelPostFormValues = z.infer<typeof travelPostSchema>;

const TravelPostCreatePage = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TravelPostFormValues>({
    resolver: zodResolver(travelPostSchema),
    defaultValues: {
      title: "",
      categoryId: "",
      destinationId: "",
      content: "",
      excerpt: "",
      tags: "",
      tripDate: "",
    },
  });

  const [filters, setFilters] = useState<TravelPostFilters | null>(null);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        setLoadingFilters(true);
        const result = await fetchTravelPostFilters();
        setFilters(result);
      } catch (error) {
        console.error("Failed to load travel post filters", error);
        toast.error("Could not load categories/destinations. Please retry later.");
      } finally {
        setLoadingFilters(false);
      }
    };

    loadFilters();
  }, []);

  const categoryOptions = useMemo(() => filters?.categories ?? [], [filters]);
  const destinationOptions = useMemo(() => filters?.destinations ?? [], [filters]);

  const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleGalleryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    if (!files.length) return;

    setGalleryFiles(files);
    setGalleryPreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const onSubmit = async (values: TravelPostFormValues) => {
    try {
      if (!coverFile) {
        toast.error("Please upload a cover image for your story.");
        return;
      }

      setIsSubmitting(true);

      const coverImageUrl = await uploadToCloudinary(coverFile);
      const galleryUrls: string[] = [];

      for (const file of galleryFiles) {
        const url = await uploadToCloudinary(file);
        galleryUrls.push(url);
      }

      const tagsArray = values.tags
        ? values.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [];

      const payload = {
        title: values.title.trim(),
        categoryId: values.categoryId,
        destinationId: values.destinationId || undefined,
        coverImageUrl,
        galleryUrls,
        content: values.content.trim(),
        excerpt: values.excerpt?.trim() || undefined,
        tags: tagsArray,
        tripDate: values.tripDate ? new Date(values.tripDate).toISOString() : undefined,
      };

      await createTravelPost(payload);

      toast.success("Your travel story was submitted for review! ✨");
      reset();
      setCoverFile(null);
      setCoverPreview(null);
      setGalleryFiles([]);
      setGalleryPreviews([]);

      navigate("/posts");
    } catch (error) {
      console.error("Failed to submit travel story", error);
      toast.error(
        error instanceof Error ? error.message : "Something went wrong while sharing your story"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-14">
        <div className="max-w-5xl mx-auto px-4">
        <div className="mb-8 flex flex-col gap-3 text-slate-700">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-400">
            Share your journey
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            Craft a travel story that inspires others
          </h1>
          <p className="max-w-3xl text-slate-600">
            Upload your highlights, tag the destinations you uncovered and help fellow travellers plan their
            adventures. Submitted stories are reviewed by our editorial team before going live.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-3xl bg-white shadow-lg ring-1 ring-slate-100 p-6 sm:p-10 space-y-6"
          >
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Story title</label>
              <input
                type="text"
                {...register("title")}
                placeholder="Sunrise above the Dolomites"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
              {errors.title && <p className="text-xs text-rose-500">{errors.title.message}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Category</label>
                <select
                  {...register("categoryId")}
                  disabled={loadingFilters || !categoryOptions.length}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                  defaultValue=""
                >
                  <option value="" disabled>
                    {loadingFilters ? "Loading categories..." : "Select a category"}
                  </option>
                  {categoryOptions.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="text-xs text-rose-500">{errors.categoryId.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Destination (optional)</label>
                <select
                  {...register("destinationId")}
                  disabled={loadingFilters || !destinationOptions.length}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                  defaultValue=""
                >
                  <option value="">Select a destination</option>
                  {destinationOptions.map((destination) => (
                    <option key={destination.id} value={destination.id}>
                      {destination.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Travel date (optional)</label>
                <input
                  type="date"
                  {...register("tripDate")}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  {...register("tags")}
                  placeholder="sunrise, hiking, solo travel"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Short teaser (optional)</label>
              <textarea
                rows={3}
                {...register("excerpt")}
                placeholder="In 200 characters or less, give readers a taste of the adventure..."
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
              {errors.excerpt && <p className="text-xs text-rose-500">{errors.excerpt.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Story body</label>
              <textarea
                rows={8}
                {...register("content")}
                placeholder="From sunrise hikes to late-night food stalls, walk readers through your journey..."
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
              {errors.content && <p className="text-xs text-rose-500">{errors.content.message}</p>}
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Cover image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverChange}
                  className="block w-full cursor-pointer rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600 focus:outline-none"
                />
                <p className="text-xs text-slate-500">Choose a hero image that sets the scene for your story.</p>
                {coverPreview && (
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="mt-3 h-40 w-full rounded-xl object-cover"
                  />
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Gallery (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryChange}
                  className="block w-full cursor-pointer rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600 focus:outline-none"
                />
                <p className="text-xs text-slate-500">Add up to 6 supporting photos that bring your journey to life.</p>
                {Boolean(galleryPreviews.length) && (
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {galleryPreviews.map((preview, index) => (
                      <img
                        key={`${preview}-${index}`}
                        src={preview}
                        alt={`Gallery preview ${index + 1}`}
                        className="h-28 w-full rounded-xl object-cover"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Submitting your story..." : "Submit for review"}
            </button>
          </form>

          <aside className="space-y-6 rounded-3xl bg-white shadow-lg ring-1 ring-slate-100 p-6">
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-slate-900">What happens next?</h2>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex gap-2">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-indigo-400"></span>
                  Our editorial team reviews every submission to keep the community inspiring and safe.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-indigo-400"></span>
                  You&apos;ll receive an email notification once your story is published or if we need more details.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-indigo-400"></span>
                  Highlight practical tips, budgets, and lessons learned—these are the insights fellow travellers love.
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-800">Need inspiration?</p>
              <p className="mt-2">
                Browse the latest community stories and see how others are structuring their travel notes.
              </p>
              <Link
                to="/posts"
                className="mt-3 inline-flex items-center text-sm font-semibold text-indigo-500 hover:text-indigo-600"
              >
                Explore published stories ↗
              </Link>
            </div>

            {filters && (
              <div className="space-y-3 text-sm text-slate-600">
                <p className="font-semibold text-slate-800">Submission checklist</p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>Write at least a short narrative (80+ characters).</li>
                  <li>Upload a striking cover image (we love landscape orientation).</li>
                  <li>
                    Tag one of the {filters.totalCategories} categories so your story appears in the right feed.
                  </li>
                  <li>
                    Optional, but recommended: attach a destination from our {filters.totalDestinations} curated spots.
                  </li>
                </ul>
              </div>
            )}
          </aside>
        </div>
        </div>
      </div>
    </>
  );
};

export default TravelPostCreatePage;
