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
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm uppercase tracking-widest text-gray-500">Share your journey</p>
          <h1 className="mb-4 font-serif text-4xl font-normal tracking-wide text-gray-900 md:text-5xl">
            CREATE YOUR TRAVEL STORY
          </h1>
          <p className="mx-auto max-w-3xl text-base leading-relaxed text-gray-600">
            Upload your highlights, tag the destinations you uncovered and help fellow travellers plan their
            adventures. Submitted stories are reviewed by our editorial team before going live.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          {/* Form Section */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 rounded-lg border border-gray-200 bg-white p-8 shadow-sm"
          >
            {/* Title */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">Story Title</label>
              <input
                type="text"
                {...register("title")}
                placeholder="Sunrise above the Dolomites"
                className="w-full rounded border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-gray-400 focus:outline-none"
              />
              {errors.title && <p className="text-xs text-red-600">{errors.title.message}</p>}
            </div>

            {/* Category & Destination */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">Category *</label>
                <select
                  {...register("categoryId")}
                  disabled={loadingFilters || !categoryOptions.length}
                  className="w-full rounded border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
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
                  <p className="text-xs text-red-600">{errors.categoryId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">Destination (optional)</label>
                <select
                  {...register("destinationId")}
                  disabled={loadingFilters || !destinationOptions.length}
                  className="w-full rounded border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
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

            {/* Travel Date & Tags */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">Travel Date (optional)</label>
                <input
                  type="date"
                  {...register("tripDate")}
                  className="w-full rounded border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-gray-400 focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  {...register("tags")}
                  placeholder="sunrise, hiking, solo travel"
                  className="w-full rounded border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-gray-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">Short Teaser (optional)</label>
              <textarea
                rows={3}
                {...register("excerpt")}
                placeholder="In 200 characters or less, give readers a taste of the adventure..."
                className="w-full rounded border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-gray-400 focus:outline-none"
              />
              {errors.excerpt && <p className="text-xs text-red-600">{errors.excerpt.message}</p>}
            </div>

            {/* Content */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">Story Body *</label>
              <textarea
                rows={10}
                {...register("content")}
                placeholder="From sunrise hikes to late-night food stalls, walk readers through your journey..."
                className="w-full rounded border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-gray-400 focus:outline-none"
              />
              {errors.content && <p className="text-xs text-red-600">{errors.content.message}</p>}
            </div>

            {/* Cover Image */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">Cover Image *</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                className="block w-full cursor-pointer rounded border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-600 focus:outline-none"
              />
              <p className="text-xs text-gray-500">Choose a hero image that sets the scene for your story.</p>
              {coverPreview && (
                <img
                  src={coverPreview}
                  alt="Cover preview"
                  className="mt-3 h-48 w-full rounded object-cover"
                />
              )}
            </div>

            {/* Gallery */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">Gallery (optional)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryChange}
                className="block w-full cursor-pointer rounded border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-600 focus:outline-none"
              />
              <p className="text-xs text-gray-500">Add up to 6 supporting photos that bring your journey to life.</p>
              {Boolean(galleryPreviews.length) && (
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {galleryPreviews.map((preview, index) => (
                    <img
                      key={`${preview}-${index}`}
                      src={preview}
                      alt={`Gallery preview ${index + 1}`}
                      className="h-32 w-full rounded object-cover"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded border border-gray-900 bg-gray-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Submitting your story..." : "Submit for Review"}
            </button>
          </form>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* What Happens Next */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 font-serif text-lg font-normal tracking-wide text-gray-900">
                What happens next?
              </h2>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex gap-3">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-900"></span>
                  <span>Our editorial team reviews every submission to keep the community inspiring and safe.</span>
                </li>
             
                <li className="flex gap-3">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-900"></span>
                  <span>Highlight practical tips, budgets, and lessons learned—these are the insights fellow travellers love.</span>
                </li>
              </ul>
            </div>

            {/* Need Inspiration */}
            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6">
              <p className="mb-2 text-sm font-semibold text-gray-900">Need inspiration?</p>
              <p className="mb-4 text-sm text-gray-600">
                Browse the latest community stories and see how others are structuring their travel notes.
              </p>
              <Link
                to="/posts"
                className="inline-flex items-center text-sm font-medium text-gray-900 underline hover:text-gray-700"
              >
                Explore published stories →
              </Link>
            </div>

            {/* Submission Checklist */}
            {filters && (
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <p className="mb-4 text-sm font-semibold text-gray-900">Submission checklist</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Write at least a short narrative (80+ characters).</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Upload a striking cover image (we love landscape orientation).</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Tag one of the {filters.totalCategories} categories so your story appears in the right feed.</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Optional, but recommended: attach a destination from our {filters.totalDestinations} curated spots.</span>
                  </li>
                </ul>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default TravelPostCreatePage;