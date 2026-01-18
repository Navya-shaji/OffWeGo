import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import type { TravelPost } from "../../../interface/TravelPost";
import { getPostBySlug, toggleSavePost, getSavedTravelPosts } from "@/services/TravelPost/TravelPostService";
import {

  ArrowLeft,
  Calendar,
  MapPin,
  Tag,
  User,
  Clock,

  Bookmark,
  ChevronRight,
  TrendingUp,
  Award,
  X
} from "lucide-react";
import Header from "@/components/home/navbar/Header";
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
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLiking, setIsLiking] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
    fetchSavedPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await getPostBySlug(slug!);
      setPost(response.data);
      setLikesCount(response.data.metrics.likes);
      setIsSaved(response.data.isSaved || false);
    } catch {
      setError("Failed to load post");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToggle = async () => {
    if (!post || isLiking) return;

    try {
      setIsLiking(true);
      const response = await toggleSavePost(post.id);
      setIsSaved(response.saved);
      setLikesCount(response.likes);

      setPost(prev => prev ? {
        ...prev,
        metrics: {
          ...prev.metrics,
          likes: response.likes
        }
      } : null);

      fetchSavedPosts();
    } catch {
      console.error("Failed to toggle save:");
    } finally {
      setIsLiking(false);
    }
  };

  const fetchSavedPosts = async () => {
    try {
      const response = await getSavedTravelPosts({ limit: 5 });
      setSavedPosts(response.data);
    } catch {
      console.error("Failed to fetch saved posts:");
    }
  };

  const handleSavedPostClick = (savedPostSlug: string) => {
    navigate(`/posts/${savedPostSlug}`);
    window.scrollTo(0, 0);
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
      <div className="min-h-screen bg-white">
        <Header forceSolid />
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          <LoadingSpinner size="xl" color="#2563eb" />
          <p className="mt-8 text-xl font-medium text-gray-400 animate-pulse font-serif italic">Gathering stories...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <Header forceSolid />
        <div className="mx-auto max-w-xl px-6 py-24 text-center">
          <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50 text-3xl">😕</div>
          <h2 className="mb-4 text-3xl font-bold text-gray-900 font-serif">Story Hidden or Lost</h2>
          <p className="mb-10 text-lg text-gray-500">{error || "The wanderer who wrote this story might have moved it to a new location."}</p>
          <Link to="/posts" className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-8 py-4 font-semibold text-white shadow-xl hover:bg-gray-800 transition-all hover:scale-105">
            <ArrowLeft className="w-5 h-5" />
            Explore Other Stories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900">
      <Header forceSolid />
      <motion.div className="fixed top-0 left-0 right-0 h-1.5 bg-blue-600 z-[60] origin-left" style={{ scaleX }} />

      <div className="relative">
        {/* Floating Controls Overlay */}
        <div className="sticky top-40 z-40 mx-auto max-w-7xl px-6 pointer-events-none">
          <div className="flex items-center justify-between pointer-events-auto">
            <button onClick={() => navigate("/posts")} className="flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-md px-5 py-2.5 text-sm font-bold text-gray-900 shadow-2xl hover:bg-white transition-all border border-white/20">
              <ArrowLeft className="w-4 h-4" /> BACK
            </button>
            <div className="flex items-center gap-3">
              <button onClick={handleSaveToggle} className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold shadow-2xl transition-all border border-white/20 ${isSaved ? "bg-red-500 text-white hover:bg-red-600" : "bg-white/80 backdrop-blur-md text-gray-900 hover:bg-white"}`}>
                {isSaved ? <Bookmark className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
                {isSaved ? "SAVED" : "SAVE"}
              </button>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        {(post.coverImageUrl || (post.galleryUrls?.length ?? 0) > 0) ? (
          <div className="relative h-[75vh] w-full overflow-hidden bg-slate-900">
            <motion.img initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 1.5 }} src={post.coverImageUrl || post.galleryUrls?.[0]} alt={post.title} className="h-full w-full object-cover opacity-70" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-black/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 py-20 px-6">
              <div className="mx-auto max-w-7xl">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-4 py-1.5 text-xs font-bold tracking-widest text-white uppercase border border-white/20">
                    <Tag className="w-3 h-3" /> {post.categoryName || "TRAVEL LOG"}
                  </div>
                  {post.destinationName && (
                    <div className="flex items-center gap-2 rounded-full bg-blue-600/30 backdrop-blur-md px-4 py-1.5 text-xs font-bold tracking-widest text-white uppercase border border-blue-400/30">
                      <MapPin className="w-3 h-3" /> {post.destinationName}
                    </div>
                  )}
                </motion.div>
                <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="mb-8 font-serif text-5xl font-medium leading-tight text-white md:text-8xl max-w-4xl">
                  {post.title}
                </motion.h1>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="flex flex-wrap items-center gap-8 text-sm font-medium text-white/80">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-white/20">
                      {post.authorProfilePicture ? <img src={post.authorProfilePicture} alt={post.authorName} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center bg-white/10"><User className="h-5 w-5" /></div>}
                    </div>
                    <span className="text-white font-bold">{post.authorName || "Explorer"}</span>
                  </div>
                  <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {dayjs(post.createdAt).format("MMM DD, YYYY")}</div>
                  <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> {dayjs(post.tripDate).format("MMMM YYYY")}</div>
                  <div className="flex items-center gap-2"><TrendingUp className="w-4 h-4" /> {post.metrics.views} views</div>
                </motion.div>
              </div>
            </div>
          </div>
        ) : (
          <div className="pt-32 pb-16 px-6 bg-gray-50 border-b border-gray-100">
            <div className="mx-auto max-w-7xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-[10px] font-black tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 uppercase">{post.categoryName || "TRAVEL LOG"}</span>
                <span className="text-[10px] font-bold text-gray-400">{dayjs(post.createdAt).format("MMM DD, YYYY")}</span>
              </div>
              <h1 className="font-serif text-4xl md:text-7xl font-normal text-gray-900 mb-8 leading-tight">{post.title}</h1>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full overflow-hidden border border-gray-200">
                  <img src={post.authorProfilePicture || "/default-avatar.png"} alt={post.authorName} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{post.authorName || "Explorer"}</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">Post Author</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white border-b border-gray-100 py-4 px-6 sticky top-24 z-30">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-gray-400 uppercase">
              <Link to="/" className="hover:text-blue-600 transition-colors">HOME</Link>
              <ChevronRight className="w-3 h-3" />
              <Link to="/posts" className="hover:text-blue-600 transition-colors">TRAVEL STORIES</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-gray-900 truncate max-w-[200px]">{post.title}</span>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
            <div className="lg:col-span-8">
              {post.excerpt && (
                <div className="mb-16 relative">
                  <div className="absolute -left-6 top-0 bottom-0 w-1 bg-blue-600/20"></div>
                  <p className="font-serif text-3xl font-light italic leading-relaxed text-gray-500">{post.excerpt}</p>
                </div>
              )}
              <article className="prose prose-xl prose-gray max-w-none prose-headings:font-serif prose-headings:font-medium prose-p:text-gray-700 prose-p:leading-[1.8] prose-img:rounded-3xl prose-img:shadow-2xl">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </article>

              {post.galleryUrls && post.galleryUrls.length > 0 && (
                <div className="mt-20 pt-16 border-t border-gray-100">
                  <h3 className="mb-10 font-serif text-3xl text-gray-900">Visual Journey</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {post.galleryUrls.map((url, index) => (
                      <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative aspect-[4/3] cursor-zoom-in overflow-hidden rounded-[2rem] shadow-2xl" onClick={() => openImageModal(index)}>
                        <img src={url} alt={`Moment ${index + 1}`} className="h-full w-full object-cover hover:scale-110 transition-transform duration-700" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {post.tags && post.tags.length > 0 && (
                <div className="mt-20 pt-10 border-t border-gray-100">
                  <h3 className="mb-6 flex items-center gap-2 text-xs font-black tracking-widest text-gray-400 uppercase"><Tag className="w-4 h-4" /> COLLECTED TAGS</h3>
                  <div className="flex flex-wrap gap-3">
                    {post.tags.map((tag, index) => (
                      <span key={index} className="rounded-full bg-gray-50 px-5 py-2 text-sm font-medium text-gray-600 border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all cursor-default">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <aside className="lg:col-span-4 space-y-12">
              <div className="rounded-[2.5rem] bg-gray-900 p-10 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:scale-150"></div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className="relative mb-6 h-32 w-32">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 animate-spin-slow p-1"><div className="h-full w-full rounded-full bg-gray-900"></div></div>
                    <div className="absolute inset-2 rounded-full overflow-hidden border-2 border-white/10">
                      {post.authorProfilePicture ? <img src={post.authorProfilePicture} alt={post.authorName} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center bg-gray-800"><User className="h-10 w-10 text-gray-500" /></div>}
                    </div>
                    <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center border-4 border-gray-900 shadow-xl"><Award className="w-5 h-5 text-white" /></div>
                  </div>
                  <h3 className="text-2xl font-bold font-serif mb-2 tracking-wide">{post.authorName || "Traveler"}</h3>
                  <p className="text-xs font-black tracking-[0.2em] text-blue-400 uppercase mb-8">VERIFIED AUTHOR</p>
                  <div className="w-full grid grid-cols-2 gap-6 pt-8 border-t border-white/10">
                    <div className="text-center"><p className="text-[10px] font-black tracking-widest text-gray-500 uppercase mb-1">LIKES GIVEN</p><p className="text-2xl font-bold">{likesCount}</p></div>
                    <div className="text-center"><p className="text-[10px] font-black tracking-widest text-gray-500 uppercase mb-1">TOTAL VIEWS</p><p className="text-2xl font-bold">{post.metrics.views}</p></div>
                  </div>
                </div>
              </div>

              {post.galleryUrls && post.galleryUrls.length > 0 && (
                <div className="rounded-[2.5rem] bg-gray-50 p-8 border border-gray-200">
                  <h3 className="text-xl font-bold font-serif text-gray-900 mb-8">Captured Moments</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {post.galleryUrls.map((url, index) => (
                      <motion.div key={index} whileHover={{ scale: 1.05 }} className="relative aspect-square cursor-zoom-in overflow-hidden rounded-2xl shadow-lg" onClick={() => openImageModal(index)}>
                        <img src={url} alt={`Gallery ${index + 1}`} className="h-full w-full object-cover" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {savedPosts.length > 0 && (
                <div className="space-y-6">
                  <h3 className="text-xs font-black tracking-[0.2em] text-gray-400 uppercase">CONTINUE READING</h3>
                  <div className="space-y-4">
                    {savedPosts.map((savedPost) => (
                      <div key={savedPost.id} className="group flex gap-4 cursor-pointer items-start p-3 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all" onClick={() => handleSavedPostClick(savedPost.slug)}>
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl shadow-md">
                          <img src={savedPost.coverImageUrl || "/default-post.jpg"} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">{savedPost.title}</h4>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">{savedPost.categoryName || "Travel"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>



        <AnimatePresence>
          {isImageModalOpen && post.galleryUrls && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-10" onClick={closeModal}>
              <button className="absolute top-10 right-10 text-white/50 hover:text-white" onClick={closeModal}><X className="w-8 h-8" /></button>
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative max-h-full max-w-full overflow-hidden rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <img src={post.galleryUrls[selectedImageIndex]} alt="Enlarged view" className="max-h-[85vh] w-auto object-contain" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TravelPostDetailPage;
