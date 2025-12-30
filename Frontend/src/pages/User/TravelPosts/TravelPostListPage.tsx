import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import type { CategoryType } from "@/interface/categoryInterface";
import type { DestinationInterface } from "@/interface/destinationInterface";
import Header from "@/components/home/navbar/Header";
import { useAppSelector } from "@/hooks";
import type { TravelPost } from "@/interface/TravelPost";
import {  fetchMyTravelPosts, fetchTravelPostFilters, fetchTravelPosts } from "@/services/TravelPost/TravelPostService";



dayjs.extend(relativeTime);

type SortOption = "latest" | "oldest" | "popular";
type StoryView = "all" | "mine";

const sortPosts = (posts: TravelPost[], sortBy: SortOption) => {
  const cloned = [...posts];
  switch (sortBy) {
    case "oldest":
      return cloned.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    case "popular":
      return cloned.sort((a, b) => b.metrics.views - a.metrics.views);
    case "latest":
    default:
      return cloned.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }
};

const TravelPostListPage = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [categoryId, setCategoryId] = useState<string>("");
  const [destinationId, setDestinationId] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [view, setView] = useState<StoryView>("all");
  const [myStatus, setMyStatus] = useState<"" | "PENDING" | "APPROVED" | "REJECTED">("");

  const approvedPostsQuery = useQuery({
    queryKey: ["travel-posts", "approved", { categoryId, destinationId, search }],
    queryFn: () =>
      fetchTravelPosts({
        categoryId: categoryId || undefined,
        destinationId: destinationId || undefined,
        search: search || undefined,
        status: "APPROVED",
      }),
    staleTime: 1000 * 60 * 5,
    enabled: view === "all",
  });

  const myPostsQuery = useQuery({
    queryKey: ["travel-posts", "mine", { categoryId, destinationId, search, myStatus }],
    queryFn: () =>
      fetchMyTravelPosts({
        categoryId: categoryId || undefined,
        destinationId: destinationId || undefined,
        search: search || undefined,
        status: myStatus || undefined,
      }),
    staleTime: 1000 * 60 * 2,
    enabled: view === "mine" && isAuthenticated,
  });

  const filtersQuery = useQuery({
    queryKey: ["travel-post-filters"],
    queryFn: fetchTravelPostFilters,
    staleTime: 1000 * 60 * 10,
  });

  const categoryOptions: CategoryType[] = filtersQuery.data?.categories ?? [];
  const destinationOptions: DestinationInterface[] = filtersQuery.data?.destinations ?? [];

  const activeQuery = view === "mine" ? myPostsQuery : approvedPostsQuery;

  const filteredPosts = useMemo(() => {
    if (!activeQuery.data?.data) return [];
    const base = activeQuery.data.data;
    return sortPosts(base, sortBy);
  }, [activeQuery.data, sortBy]);

  const renderPostCard = (post: TravelPost) => {
    const statusBadge =
      view === "mine" ? (
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
            post.status === "APPROVED"
              ? "bg-emerald-50 text-emerald-600"
              : post.status === "REJECTED"
                ? "bg-rose-50 text-rose-600"
                : "bg-amber-50 text-amber-700"
          }`}
        >
          {post.status}
        </span>
      ) : null;

    return (
      <Link
        key={post.id}
        to={`/posts/${post.slug}`}
        className="flex flex-col rounded-3xl bg-white shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-lg"
      >
        {post.coverImageUrl && (
          <div className="relative h-56 w-full overflow-hidden rounded-t-3xl">
            <img
              src={post.coverImageUrl}
              alt={post.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/80">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-white/90">
                {post.categoryName || "Travel"}
              </span>
              {post.destinationName && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1">
                  {post.destinationName}
                </span>
              )}
            </div>
          </div>
        )}
        <div className="flex flex-1 flex-col space-y-4 p-6">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-indigo-400">
              {post.authorName ? `Shared by ${post.authorName}` : "Community story"}
            </p>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h2 className="text-xl font-semibold text-slate-900">{post.title}</h2>
              {statusBadge}
            </div>
            <p className="text-sm leading-6 text-slate-600">
              {post.excerpt || `${post.content.slice(0, 180)}...`}
            </p>
          </div>
          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">
              {dayjs(post.createdAt).format("MMM D, YYYY")}
              {post.tripDate ? ` · Trip ${dayjs(post.tripDate).format("MMM YYYY")}` : ""}
            </span>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {post.metrics.views} views
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                {post.metrics.likes} saves
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        <header className="space-y-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-indigo-400">
                Community stories
              </p>
              <h1 className="text-4xl font-bold text-slate-900">Travel Stories</h1>
              <p className="max-w-2xl text-sm text-slate-600">
                Discover authentic adventures, practical itineraries, and hidden gems from fellow explorers. Use the
                filters to narrow down by category or destination, then dive into the stories that speak to your next
                getaway.
              </p>
            </div>

            <Link
              to="/posts/new"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-indigo-600 hover:to-purple-700"
            >
              Share your story
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setView("all")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                view === "all"
                  ? "bg-indigo-600 text-white shadow"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
              }`}
            >
              All stories (Approved)
            </button>
            <button
              type="button"
              onClick={() => setView("mine")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                view === "mine"
                  ? "bg-indigo-600 text-white shadow"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
              }`}
            >
              My submissions
            </button>
            {view === "mine" && (
              <select
                value={myStatus}
                onChange={(event) =>
                  setMyStatus(event.target.value as "" | "PENDING" | "APPROVED" | "REJECTED")
                }
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">All statuses</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            )}
          </div>

          <div className="grid gap-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:grid-cols-4">
            <div className="space-y-1 lg:col-span-1">
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">All categories</option>
                {categoryOptions.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1 lg:col-span-1">
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Destination
              </label>
              <select
                value={destinationId}
                onChange={(event) => setDestinationId(event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">All destinations</option>
                {destinationOptions.map((destination) => (
                  <option key={destination.id} value={destination.id}>
                    {destination.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1 lg:col-span-1">
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Search
              </label>
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by story title or tags"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="space-y-1 lg:col-span-1">
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Sort by
              </label>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as SortOption)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              >
                <option value="latest">Latest</option>
                <option value="popular">Most viewed</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          </div>
        </header>

        {view === "mine" && !isAuthenticated ? (
          <div className="rounded-3xl border border-amber-100 bg-amber-50 p-8 text-center text-amber-700">
            <h2 className="text-xl font-semibold">Login required</h2>
            <p className="mt-2 text-sm text-amber-600">
              Please login to view your submitted stories (including pending approvals).
            </p>
            <Link
              to="/login"
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white shadow transition hover:bg-amber-700"
            >
              Go to login
            </Link>
          </div>
        ) : activeQuery.isLoading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-500" />
          </div>
        ) : activeQuery.isError ? (
          <div className="rounded-3xl border border-rose-100 bg-rose-50 p-8 text-center text-rose-500">
            <h2 className="text-xl font-semibold">We couldn&apos;t load the latest stories.</h2>
            <p className="mt-2 text-sm text-rose-400">
              Please refresh the page or try again later. If the issue persists, contact support so we can help out.
            </p>
          </div>
        ) : !filteredPosts.length ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
              <span className="text-2xl font-semibold">✦</span>
            </div>
            <h2 className="text-xl font-semibold text-slate-900">No stories match your filters</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
              Try adjusting the filters or broaden your search to explore a wider range of adventures. You can also
              contribute a fresh story that fits your wanderlust.
            </p>
            <Link
              to="/posts/new"
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-indigo-600 hover:to-purple-700"
            >
              Share your story
            </Link>
          </div>
        ) : (
          <section className="grid gap-6 md:grid-cols-2">
            {filteredPosts.map((post) => renderPostCard(post))}
          </section>
        )}
      </div>
    </div>
  );
};

export default TravelPostListPage;
