import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { TravelPost } from "../../../interface/TravelPost";
import { getPostBySlug, toggleSavePost, getSavedTravelPosts } from "@/services/TravelPost/TravelPostService";
import { FaHeart, FaRegHeart, FaArrowLeft, FaEye, FaCalendar, FaUser, FaMapMarkerAlt, FaTag } from "react-icons/fa";
import Header from "../../../components/home/navbar/Header";

type TravelPostDetailProps = object;

const TravelPostDetailPage: React.FC<TravelPostDetailProps> = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<TravelPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [savedPosts, setSavedPosts] = useState<TravelPost[]>([]);
  const [savedPostsLoading, setSavedPostsLoading] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
    fetchSavedPosts();
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await getPostBySlug(slug!);
      setPost(response.data);
      setLikesCount(response.data.metrics.likes);
      setIsSaved(response.data.isSaved || false);
    } catch (err: any) {
      setError(err.message || "Failed to load post");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToggle = async () => {
    if (!post) return;
    
    try {
      const response = await toggleSavePost(post.id);
      setIsSaved(response.saved);
      setLikesCount(response.likes);
      fetchSavedPosts();
    } catch (err: any) {
      console.error("Failed to toggle save:", err);
    }
  };

  const fetchSavedPosts = async () => {
    try {
      setSavedPostsLoading(true);
      const response = await getSavedTravelPosts({ limit: 5 });
      setSavedPosts(response.data);
    } catch (err: any) {
      console.error("Failed to fetch saved posts:", err);
    } finally {
      setSavedPostsLoading(false);
    }
  };

  const handleSavedPostClick = (savedPostSlug: string) => {
    navigate(`/posts/${savedPostSlug}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900"></div>
          <p className="text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="text-center">
          <button 
            onClick={() => navigate(-1)} 
            className="mb-4 inline-flex items-center gap-2 rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400"
          >
            <FaArrowLeft /> Back
          </button>
          <p className="text-gray-600">{error || "Post not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header Actions */}
        <div className="mb-8 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)} 
            className="inline-flex items-center gap-2 rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400"
          >
            <FaArrowLeft /> Back to Posts
          </button>
          
          <button
            onClick={handleSaveToggle}
            className={`inline-flex items-center gap-2 rounded border px-4 py-2 text-sm font-medium transition-colors ${
              isSaved 
                ? "border-red-500 bg-red-500 text-white hover:bg-red-600" 
                : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
            }`}
          >
            {isSaved ? <FaHeart /> : <FaRegHeart />}
            <span>{isSaved ? "Saved" : "Save"}</span>
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <article>
              {/* Title */}
              <h1 className="mb-6 font-serif text-4xl font-normal leading-tight tracking-wide text-gray-900 md:text-5xl">
                {post.title}
              </h1>
              
              {/* Meta Information */}
              <div className="mb-6 flex flex-wrap gap-4 border-b border-gray-200 pb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {/* <FaUser className="text-gray-400" /> */}
                  {/* <span>Author ID: {post.authorId}</span> */}
                </div>
                
                {post.destinationId && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaMapMarkerAlt className="text-gray-400" />
                    <span>Destination ID: {post.destinationId}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaCalendar className="text-gray-400" />
                  <span>{formatDate(post.createdAt)}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {/* <FaEye className="text-gray-400" />
                  <span>{post.metrics.views} views</span> */}
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaHeart className="text-gray-400" />
                  <span>{likesCount} likes</span>
                </div>
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mb-6 flex flex-wrap items-center gap-2">
                  <FaTag className="text-gray-400" />
                  {post.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Excerpt */}
              {post.excerpt && (
                <div className="mb-8 rounded-lg bg-gray-50 p-6">
                  <p className="text-lg leading-relaxed text-gray-700">{post.excerpt}</p>
                </div>
              )}

              {/* Content */}
              <div 
                className="prose prose-gray max-w-none prose-headings:font-serif prose-headings:font-normal prose-headings:tracking-wide prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:leading-relaxed prose-a:text-gray-900 prose-a:underline prose-img:rounded-lg"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </article>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Cover Image */}
            {post.coverImageUrl && (
              <div className="overflow-hidden rounded-lg shadow-md">
                <img
                  src={post.coverImageUrl}
                  alt={post.title}
                  className="h-auto w-full object-cover"
                />
              </div>
            )}

            {/* Gallery */}
            {post.galleryUrls && post.galleryUrls.length > 0 && (
              <div>
                <h3 className="mb-4 font-serif text-xl font-normal tracking-wide text-gray-900">
                  Gallery
                </h3>
                <div className="space-y-4">
                  {post.galleryUrls.map((url, index) => (
                    <div 
                      key={index} 
                      className="cursor-pointer overflow-hidden rounded-lg shadow-md transition-transform hover:scale-105"
                      onClick={() => window.open(url, '_blank')}
                    >
                      <img
                        src={url}
                        alt={`${post.title} - Image ${index + 1}`}
                        className="h-auto w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Saved Posts */}
            <div>
              {/* <h3 className="mb-4 font-serif text-xl font-normal tracking-wide text-gray-900">
                Saved Posts
              </h3> */}
              
              {savedPostsLoading ? (
                <div className="text-center text-sm text-gray-500">
                  Loading saved posts...
                </div>
              ) : savedPosts.length > 0 ? (
                <div className="space-y-4">
                  {savedPosts.map((savedPost) => (
                    <div 
                      key={savedPost.id} 
                      className="group cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:shadow-lg"
                      onClick={() => handleSavedPostClick(savedPost.slug)}
                    >
                      {savedPost.coverImageUrl && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={savedPost.coverImageUrl}
                            alt={savedPost.title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h4 className="mb-2 font-medium text-gray-900 line-clamp-2">
                          {savedPost.title}
                        </h4>
                        <p className="mb-3 text-sm text-gray-600 line-clamp-2">
                          {savedPost.excerpt}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <FaEye /> {savedPost.metrics.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaHeart /> {savedPost.metrics.likes}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg bg-gray-50 p-6 text-center">
                  {/* <p className="text-sm text-gray-600">
                    No saved posts yet. Start saving your favorite travel stories!
                  </p> */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelPostDetailPage;