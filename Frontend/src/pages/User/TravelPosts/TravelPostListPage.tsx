import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { fetchMyTravelPosts, fetchTravelPostFilters, fetchTravelPosts } from "@/services/TravelPost/TravelPostService";
import type { TravelPost } from "@/interface/TravelPost";
import type { CategoryType } from "@/interface/categoryInterface";
import type { DestinationInterface } from "@/interface/destinationInterface";
import Header from "@/components/home/navbar/Header";
import { useAppSelector } from "@/hooks";

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
  const [categoryId, setCategoryId] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [view, setView] = useState("all");
  const [myStatus, setMyStatus] = useState<"" | "PENDING" | "APPROVED" | "REJECTED">("");

  const approvedPostsQuery = useQuery({
    queryKey: ["travel-posts", "approved"],
    queryFn: () =>
      fetchTravelPosts({
        status: "APPROVED",
      }),
    staleTime: 1000 * 60 * 5,
    enabled: view === "all",
  });

  const myPostsQuery = useQuery({
    queryKey: ["travel-posts", "mine", { myStatus }],
    queryFn: () =>
      fetchMyTravelPosts({
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

  console.log(" Frontend Debug - Available categories:", categoryOptions);
  console.log(" Frontend Debug - Available destinations:", destinationOptions);

  const activeQuery = view === "mine" ? myPostsQuery : approvedPostsQuery;

  const filteredPosts = useMemo(() => {
    if (!activeQuery.data?.data) return [];
    const base = activeQuery.data.data;
    
    console.log(" Frontend Debug - Active query data:", activeQuery.data);
    console.log(" Frontend Debug - Raw posts array:", base);
    console.log(" Frontend Debug - Posts length:", base?.length);
    console.log(" Frontend Debug - Filters applied:", { categoryId, destinationId, search, sortBy });
    
    // Apply frontend filtering
    let filtered = base;
    
    // Filter by category
    if (categoryId) {
      filtered = filtered.filter(post => post.categoryId === categoryId);
      console.log(` Frontend Debug - After category filter (${categoryId}):`, filtered.length, "posts");
    }
    
    // Filter by destination
    if (destinationId) {
      filtered = filtered.filter(post => post.destinationId === destinationId);
      console.log(` Frontend Debug - After destination filter (${destinationId}):`, filtered.length, "posts");
    }
    
    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchLower) ||
        post.content.toLowerCase().includes(searchLower) ||
        post.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
      console.log(` Frontend Debug - After search filter ("${search}"):`, filtered.length, "posts");
    }
    
    // Sort the filtered results
    const sorted = sortPosts(filtered, sortBy);
    console.log(" Frontend Debug - Final sorted posts:", sorted);
    
    return sorted;
  }, [activeQuery.data, categoryId, destinationId, search, sortBy]);

  const renderPostCard = (post: TravelPost) => {
    const statusBadge = view === "mine" ? (
      <span className="absolute right-4 top-4 rounded px-2 py-1 text-xs font-semibold uppercase text-white backdrop-blur-sm"
        style={{
          backgroundColor: post.status === "APPROVED" ? "rgba(34, 197, 94, 0.9)" : post.status === "PENDING" ? "rgba(234, 179, 8, 0.9)" : "rgba(239, 68, 68, 0.9)"
        }}>
        {post.status}
      </span>
    ) : null;

    return (
      <Link
        to={`/posts/${post.slug}`}
        key={post.id}
        className="group relative block overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      >
        {post.coverImageUrl && (
          <div className="relative aspect-[3/4] overflow-hidden">
            <img
              src={post.coverImageUrl}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            
            {statusBadge}

            <div className="absolute left-4 top-4">
              <span className="inline-block rounded bg-black/60 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white backdrop-blur-sm">
                {dayjs(post.createdAt).format("DD MMM").toUpperCase()}
              </span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="mb-2 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-800">
                  {post.categoryName || "Travel"}
                </span>
                {post.destinationName && (
                  <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-800">
                    {post.destinationName}
                  </span>
                )}
              </div>

              <p className="mb-2 text-xs uppercase tracking-wider text-white/80">
                {post.authorName ? `Shared by ${post.authorName}` : "Community story"}
              </p>

              <h2 className="mb-2 text-xl font-bold leading-tight text-white">
                {post.title}
              </h2>

              <p className="mb-3 line-clamp-2 text-sm text-white/90">
                {post.excerpt || `${post.content.slice(0, 120)}...`}
              </p>

              <div className="flex items-center gap-4 text-xs text-white/80">
                <span>
                  {dayjs(post.createdAt).format("MMM D, YYYY")}
                  {post.tripDate ? ` · Trip ${dayjs(post.tripDate).format("MMM YYYY")}` : ""}
                </span>
              </div>

              <div className="mt-3 flex items-center gap-4 text-xs text-white/80">
                <span>{post.metrics.views} views</span>
                <span>{post.metrics.likes} saves</span>
              </div>
            </div>
          </div>
        )}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm uppercase tracking-widest text-gray-500">Community stories</p>
          <h1 className="mb-4 font-serif text-4xl font-normal tracking-wide text-gray-900 md:text-5xl">
            MY TRAVEL STORIES & THOUGHTS
          </h1>
          <p className="mx-auto max-w-3xl text-base leading-relaxed text-gray-600">
            I learn so much from traveling, and sometimes I just observe and experience a lot that I want to put out into the world. This is where you can find some of those random stories, thoughts and lessons.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-3">
            <button
              onClick={() => setView("all")}
              className={`rounded border px-5 py-2 text-sm font-medium transition-colors ${
                view === "all"
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
              }`}
            >
              All stories
            </button>
            <button
              onClick={() => setView("mine")}
              className={`rounded border px-5 py-2 text-sm font-medium transition-colors ${
                view === "mine"
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
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
                className="rounded border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 focus:border-gray-400 focus:outline-none"
              >
                <option value="">All statuses</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            )}
          </div>

          <Link
            to="/posts/new"
            className="rounded border border-gray-900 bg-gray-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            Share your story
          </Link>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <div className="md:col-span-2">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by story title or tags"
              className="w-full rounded border border-gray-300 px-4 py-2.5 text-sm text-gray-700 focus:border-gray-400 focus:outline-none"
            />
          </div>

          <select
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            className="rounded border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 focus:border-gray-400 focus:outline-none"
          >
            <option value="">All Categories</option>
            {categoryOptions.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            value={destinationId}
            onChange={(event) => setDestinationId(event.target.value)}
            className="rounded border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 focus:border-gray-400 focus:outline-none"
          >
            <option value="">All Destinations</option>
            {destinationOptions.map((destination) => (
              <option key={destination.id} value={destination.id}>
                {destination.name}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as SortOption)}
            className="rounded border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 focus:border-gray-400 focus:outline-none"
          >
            <option value="latest">Latest First</option>
            <option value="popular">Most Viewed</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {(search || categoryId || destinationId || sortBy !== "latest") && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {search && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                Search: "{search}"
                <button
                  onClick={() => setSearch("")}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </span>
            )}
            {categoryId && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                Category: {categoryOptions.find(c => c.id === categoryId)?.name || categoryId}
                <button
                  onClick={() => setCategoryId("")}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </span>
            )}
            {destinationId && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                Destination: {destinationOptions.find(d => d.id === destinationId)?.name || destinationId}
                <button
                  onClick={() => setDestinationId("")}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </span>
            )}
            {sortBy !== "latest" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                Sort: {sortBy === "popular" ? "Most Viewed" : "Oldest First"}
                <button
                  onClick={() => setSortBy("latest")}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </span>
            )}
            <button
              onClick={() => {
                setSearch("");
                setCategoryId("");
                setDestinationId("");
                setSortBy("latest");
                setMyStatus("");
              }}
              className="rounded border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50"
            >
              Clear all filters
            </button>
          </div>
        )}

        <h2 className="mb-8 text-center font-serif text-2xl font-normal tracking-wide text-gray-900">
          TRAVEL STORY POSTS
        </h2>

        {view === "mine" && !isAuthenticated ? (
          <div className="rounded-lg bg-gray-50 p-12 text-center">
            <h3 className="mb-2 text-xl font-semibold text-gray-900">Login required</h3>
            <p className="mb-6 text-gray-600">
              Please login to view your submitted stories (including pending approvals).
            </p>
            <Link
              to="/login"
              className="inline-block rounded border border-gray-900 bg-gray-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
            >
              Go to login
            </Link>
          </div>
        ) : activeQuery.isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900"></div>
          </div>
        ) : activeQuery.isError ? (
          <div className="rounded-lg bg-gray-50 p-12 text-center">
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              We couldn't load the latest stories.
            </h3>
            <p className="text-gray-600">
              Please refresh the page or try again later. If the issue persists, contact support so we can help out.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Error: {activeQuery.error?.message}
            </p>
          </div>
        ) : !filteredPosts.length ? (
          <div className="rounded-lg bg-gray-50 p-12 text-center">
            <p className="mb-2 text-4xl">✦</p>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">No stories match your filters</h3>
            <p className="mb-6 text-gray-600">
              Try adjusting the filters or broaden your search to explore a wider range of adventures. You can also contribute a fresh story that fits your wanderlust.
            </p>
            <div className="text-sm text-gray-500 mb-4">
              <p>Active filters: {JSON.stringify({ categoryId, destinationId, search, sortBy })}</p>
              <p>Data available: {activeQuery.data?.data?.length || 0} posts</p>
              <p>Filtered posts: {filteredPosts.length}</p>
            </div>
            <Link
              to="/posts/new"
              className="inline-block rounded border border-gray-900 bg-gray-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
            >
              Share your story
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => renderPostCard(post))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelPostListPage;