import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchTravelPosts } from "@/services/TravelPost/TravelPostService";
import type { TravelPost } from "@/interface/TravelPost";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { MapPin, Eye, Heart, User } from "lucide-react";

dayjs.extend(relativeTime);

const TravelStories = () => {
  const { data: postsData, isLoading, error } = useQuery({
    queryKey: ["travel-posts-home"],
    queryFn: () => fetchTravelPosts({ page: 1, limit: 6, sortBy: "latest" }),
  });

  const posts = postsData?.data || [];

  if (isLoading) {
    return (
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">
              Featured Travel Stories
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover amazing adventures and travel experiences from our community
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 rounded-2xl h-64"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-red-600">Failed to load travel stories. Please try again later.</p>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">
              Travel Stories
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              No stories yet. Be the first to share your travel adventure!
            </p>
            <Link
              to="/posts/new"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
            >
              Share Your Story
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-serif text-gray-900 mb-4 tracking-wide">
            Travel Stories & Adventures
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover amazing travel experiences, hidden gems, and insider tips from our community of passionate travelers
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {posts.map((post) => (
            <article
              key={post.id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.coverImageUrl || "/images/travel-placeholder.jpg"}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Overlay with quick info */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-white text-sm">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {post.metrics?.views || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {post.metrics?.likes || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Destination Badge */}
                {post.destinationName && (
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {post.destinationName}
                    </span>
                  </div>
                )}

                {/* Title */}
                <h3 className="mb-3 text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  <Link to={`/posts/${post.slug}`} className="hover:underline">
                    {post.title}
                  </Link>
                </h3>

                {/* Excerpt */}
                <p className="mb-4 text-gray-600 line-clamp-3 leading-relaxed">
                  {post.excerpt || `${post.content?.slice(0, 150)}...`}
                </p>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{post.authorName || "Anonymous"}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span>{dayjs(post.createdAt).format("MMM D, YYYY")}</span>
                    {post.tripDate && (
                      <>
                        <span className="text-gray-300">•</span>
                        <span>Trip {dayjs(post.tripDate).format("MMM YYYY")}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="text-xs text-gray-400">+{post.tags.length - 3} more</span>
                    )}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            to="/posts"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-gray-800 hover:to-gray-700 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 duration-300"
          >
            Explore All Stories
            <div className="w-5 h-5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TravelStories;
