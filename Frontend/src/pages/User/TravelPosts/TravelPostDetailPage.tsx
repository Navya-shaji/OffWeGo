import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { TravelPost } from "../../../interface/TravelPost";
import { getPostBySlug, toggleSavePost, getSavedTravelPosts } from "@/services/TravelPost/TravelPostService";
import { FaHeart, FaRegHeart, FaArrowLeft, FaEye, FaCalendar, FaUser, FaMapMarkerAlt, FaTag } from "react-icons/fa";
import Header from "../../../components/home/navbar/Header";
import "./TravelPostDetailPage.css";

type TravelPostDetailProps = object

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
      // Refresh saved posts list after toggling
      fetchSavedPosts();
    } catch (err: any) {
      console.error("Failed to toggle save:", err);
    }
  };

  const fetchSavedPosts = async () => {
    try {
      setSavedPostsLoading(true);
      const response = await getSavedTravelPosts({ limit: 5 }); // Show 5 recent saved posts
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
      <div className="travel-post-detail-loading">
        <div className="spinner"></div>
        <p>Loading post...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="travel-post-detail-error">
        <button onClick={() => navigate(-1)} className="back-button">
          <FaArrowLeft /> Back
        </button>
        <p>{error || "Post not found"}</p>
      </div>
    );
  }

  return (
    <div className="travel-post-detail-page">
      <Header />
      <div className="travel-post-detail-container">
        <div className="travel-post-detail-header">
          <button onClick={() => navigate(-1)} className="back-button">
            <FaArrowLeft /> Back to Posts
          </button>
          
          <div className="post-actions">
            <button
              onClick={handleSaveToggle}
              className={`save-button ${isSaved ? "saved" : ""}`}
            >
              {isSaved ? <FaHeart /> : <FaRegHeart />}
              <span>{isSaved ? "Saved" : "Save"}</span>
            </button>
          </div>
        </div>

        <div className="travel-post-detail-content-horizontal">
          <div className="post-main-content">
            <article className="post-content-wrapper">
              <header className="post-header">
                <h1 className="post-title">{post.title}</h1>
                
                <div className="post-meta">
                  <div className="meta-item">
                    <FaUser className="meta-icon" />
                    <span>Author ID: {post.authorId}</span>
                  </div>
                  
                  <div className="meta-item">
                    <FaMapMarkerAlt className="meta-icon" />
                    <span>Destination ID: {post.destinationId || 'Not specified'}</span>
                  </div>
                  
                  <div className="meta-item">
                    <FaCalendar className="meta-icon" />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                  
                  <div className="meta-item">
                    <FaEye className="meta-icon" />
                    <span>{post.metrics.views} views</span>
                  </div>
                  
                  <div className="meta-item">
                    <FaHeart className="meta-icon" />
                    <span>{likesCount} likes</span>
                  </div>
                </div>

                {post.tags && post.tags.length > 0 && (
                  <div className="post-tags">
                    <FaTag className="tags-icon" />
                    {post.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </header>

              {post.excerpt && (
                <div className="post-excerpt">
                  <p>{post.excerpt}</p>
                </div>
              )}

              <div className="post-body">
                <div
                  className="post-content"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>
            </article>
          </div>

          <div className="post-sidebar">
            {post.coverImageUrl && (
              <div className="post-cover-image">
                <img
                  src={post.coverImageUrl}
                  alt={post.title}
                  className="cover-image"
                />
              </div>
            )}

            {post.galleryUrls && post.galleryUrls.length > 0 && (
              <div className="post-gallery">
                <h3 className="gallery-title">Gallery</h3>
                <div className="gallery-grid-vertical">
                  {post.galleryUrls.map((url, index) => (
                    <div key={index} className="gallery-item">
                      <img
                        src={url}
                        alt={`${post.title} - Image ${index + 1}`}
                        className="gallery-image"
                        onClick={() => window.open(url, '_blank')}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Saved Posts Section */}
            <div className="saved-posts-section">
              <h3 className="saved-posts-title">Saved Posts</h3>
              {savedPostsLoading ? (
                <div className="saved-posts-loading">Loading saved posts...</div>
              ) : savedPosts.length > 0 ? (
                <div className="saved-posts-list">
                  {savedPosts.map((savedPost) => (
                    <div 
                      key={savedPost.id} 
                      className="saved-post-item"
                      onClick={() => handleSavedPostClick(savedPost.slug)}
                    >
                      {savedPost.coverImageUrl && (
                        <img
                          src={savedPost.coverImageUrl}
                          alt={savedPost.title}
                          className="saved-post-image"
                        />
                      )}
                      <div className="saved-post-content">
                        <h4 className="saved-post-title">{savedPost.title}</h4>
                        <p className="saved-post-excerpt">{savedPost.excerpt}</p>
                        <div className="saved-post-meta">
                          <span className="saved-post-views">
                            <FaEye /> {savedPost.metrics.views} views
                          </span>
                          <span className="saved-post-likes">
                            <FaHeart /> {savedPost.metrics.likes} likes
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-saved-posts">
                  <p>No saved posts yet. Start saving your favorite travel stories!</p>
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
