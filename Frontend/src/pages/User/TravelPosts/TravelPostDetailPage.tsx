import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import type { TravelPost } from "../../../interface/TravelPost";
import { getPostBySlug, toggleSavePost, getSavedTravelPosts } from "@/services/TravelPost/TravelPostService";
import { 
  Heart, 
  ArrowLeft, 
  Eye, 
  Calendar, 
  MapPin, 
  Tag, 
  User,
  Clock,
  Share2,
  Bookmark
} from "lucide-react";
import Header from "../../../components/home/navbar/Header";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const TravelPostDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<TravelPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [savedPosts, setSavedPosts] = useState<TravelPost[]>([]);
  const [savedPostsLoading, setSavedPostsLoading] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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

  const handleShare = () => {
    if (navigator.share && post) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const openImageModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsImageModalOpen(true);
  };

  const closeModal = () => {
    setIsImageModalOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
            <p className="text-lg font-medium text-gray-600">Loading your travel story...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mx-auto mb-6 h-24 w-24 rounded-full bg-red-100 flex items-center justify-center">
              <div className="text-4xl">📝</div>
            </div>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Story Not Found</h2>
            <p className="mb-6 text-gray-600 max-w-md">{error || "This travel story couldn't be found or has been removed."}</p>
            <Link
              to="/posts"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Stories
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />
      
      {/* Hero Section with Cover Image */}
      <div className="relative h-96 overflow-hidden">
        {post.coverImageUrl && (
          <img
            src={post.coverImageUrl}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        
        {/* Floating Action Buttons */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <Link
            to="/posts"
            className="flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-sm px-4 py-2 text-sm font-medium text-gray-800 hover:bg-white transition-all shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-sm px-4 py-2 text-sm font-medium text-gray-800 hover:bg-white transition-all shadow-lg"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
            
            <button
              onClick={handleSaveToggle}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all shadow-lg ${
                isSaved 
                  ? "bg-red-500 text-white hover:bg-red-600" 
                  : "bg-white/90 backdrop-blur-sm text-gray-800 hover:bg-white"
              }`}
            >
              {isSaved ? <Bookmark className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
              {isSaved ? "Saved" : "Save"}
            </button>
          </div>
        </div>
        
        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="mb-4 font-serif text-4xl font-bold leading-tight tracking-wide md:text-6xl">
              {post.title}
            </h1>
            
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-sm">
              {post.authorName && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{post.authorName}</span>
                </div>
              )}
              
              {post.destinationName && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{post.destinationName}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{dayjs(post.createdAt).format("MMMM D, YYYY")}</span>
              </div>
              
              {post.tripDate && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Trip {dayjs(post.tripDate).format("MMMM YYYY")}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Excerpt */}
            {post.excerpt && (
              <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 p-8 border border-blue-100">
                <p className="text-lg leading-relaxed text-gray-800 italic">
                  "{post.excerpt}"
                </p>
              </div>
            )}

            {/* Content */}
            <article className="prose prose-lg prose-gray max-w-none prose-headings:font-serif prose-headings:font-normal prose-headings:tracking-wide prose-headings:text-gray-900 prose-p:leading-relaxed prose-p:text-gray-700 prose-a:text-blue-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl prose-img:shadow-lg">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </article>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="rounded-2xl bg-gray-50 p-6 border border-gray-200">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <Tag className="w-5 h-5 text-gray-600" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2 text-sm font-medium text-blue-800 border border-blue-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Engagement Stats */}
            <div className="rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 p-6 border border-purple-200">
              <div className="flex items-center justify-around">
                <div className="text-center">
                  <div className="mb-2 flex items-center justify-center">
                    <Eye className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{post.metrics.views}</p>
                  <p className="text-sm text-gray-600">Views</p>
                </div>
                
                <div className="text-center">
                  <div className="mb-2 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-pink-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{likesCount}</p>
                  <p className="text-sm text-gray-600">Likes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Gallery */}
            {post.galleryUrls && post.galleryUrls.length > 0 && (
              <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-200">
                <h3 className="mb-4 text-xl font-bold text-gray-900">Photo Gallery</h3>
                <div className="grid gap-3">
                  {post.galleryUrls.slice(0, 6).map((url, index) => (
                    <div
                      key={index}
                      className="group cursor-pointer overflow-hidden rounded-lg"
                      onClick={() => openImageModal(index)}
                    >
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={url}
                          alt={`${post.title} - Image ${index + 1}`}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="mt-2 text-center">
                        <p className="text-sm text-gray-600">Photo {index + 1}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Saved Posts */}
            {savedPosts.length > 0 && (
              <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-200">
                <h3 className="mb-4 text-xl font-bold text-gray-900">Saved Stories</h3>
                <div className="space-y-4">
                  {savedPosts.map((savedPost) => (
                    <div
                      key={savedPost.id}
                      className="group cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:shadow-lg hover:border-blue-300"
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
                        <h4 className="mb-2 font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {savedPost.title}
                        </h4>
                        <p className="mb-3 text-sm text-gray-600 line-clamp-2">
                          {savedPost.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{dayjs(savedPost.createdAt).format("MMM D, YYYY")}</span>
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {savedPost.metrics.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              {savedPost.metrics.likes}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {isImageModalOpen && post.galleryUrls && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div className="relative max-w-6xl max-h-[90vh] p-4">
            <img
              src={post.galleryUrls[selectedImageIndex]}
              alt={`${post.title} - Image ${selectedImageIndex + 1}`}
              className="max-h-[80vh] w-auto rounded-lg shadow-2xl"
            />
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 rounded-full bg-white/90 p-2 text-gray-800 hover:bg-white transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelPostDetailPage;