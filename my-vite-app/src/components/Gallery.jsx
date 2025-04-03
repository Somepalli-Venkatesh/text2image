import React, { useState, useEffect, useRef } from "react";
import { apiGet, apiDelete } from "../utils/api";
import { motion, AnimatePresence } from "framer-motion";
import Toast from "./Toast";
import {
  Download,
  Trash2,
  Share2,
  Heart,
  MessageCircle,
  Search,
  X,
  Send,
  Image as ImageIcon,
  Plus,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function Gallery() {
  // Data & UI states
  const [galleryItems, setGalleryItems] = useState([]);
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [lightbox, setLightbox] = useState({
    isOpen: false,
    currentIndex: 0,
  });
  const [openCommentOverlays, setOpenCommentOverlays] = useState({});
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem("favorites");
    return stored ? JSON.parse(stored) : [];
  });
  const [selectedTags, setSelectedTags] = useState([]);
  const [theme, setTheme] = useState("dark");

  const lightboxRef = useRef(null);

  // -------------------------------
  // Fetch gallery items on mount.
  useEffect(() => {
    apiGet("/gallery").then((data) => {
      if (data.gallery_items) {
        setGalleryItems(data.gallery_items);
      }
    });
  }, []);

  // -------------------------------
  // Poll for updates (likes/comments) every 5 seconds.
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetch(`${BACKEND_URL}/api/get-updates`, { credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            console.error("Error fetching updates:", data.error);
            // Optionally, show a toast or redirect to login
            return;
          }
          if (Array.isArray(data)) {
            setGalleryItems((prevItems) =>
              prevItems.map((item) => {
                const update = data.find((u) => u.imageId === item.filename);
                if (update) {
                  return {
                    ...item,
                    likeCount: update.likeCount,
                    commentCount: update.commentCount,
                  };
                }
                return item;
              })
            );
          } else {
            console.error("Unexpected data format:", data);
          }
        })
        .catch((err) => console.error("Error fetching updates:", err));
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  // -------------------------------
  // Sparkles Background Effect (subtle, without glow)
  useEffect(() => {
    const container = document.querySelector(".sparkles-animation");
    if (!container) return;
    const canvas = document.createElement("canvas");
    canvas.classList.add("sparkle-canvas");
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.zIndex = "0";
    container.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    let particles = [];

    const resizeCanvas = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    class Sparkle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speed = Math.random() * 0.5 + 0.2;
        this.baseOpacity = Math.random() * 0.5 + 0.5;
        this.twinkle = Math.random() * Math.PI * 2;
        this.direction = Math.random() * Math.PI * 2;
      }
      update() {
        this.x += Math.cos(this.direction) * this.speed;
        this.y += Math.sin(this.direction) * this.speed;
        this.twinkle += 0.1;
        if (
          this.x < 0 ||
          this.x > canvas.width ||
          this.y < 0 ||
          this.y > canvas.height
        ) {
          this.reset();
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        const opacity = this.baseOpacity * ((Math.sin(this.twinkle) + 1) / 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
      }
    }

    const sparkleCount = 80;
    for (let i = 0; i < sparkleCount; i++) {
      particles.push(new Sparkle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    };

    animate();
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  // -------------------------------
  // Delete image handler.
  // Delete image handler.
  const handleDelete = async (imagePath) => {
    // imagePath is in the format "username/filename"
    if (window.confirm("Are you sure you want to delete this image?")) {
      // Construct the URL correctly. If VITE_BACKEND_URL already includes `/api`, don't add it here.
      const deleteUrl = `${BACKEND_URL}/delete_image/${encodeURIComponent(
        imagePath
      )}`;
      console.log("DELETE URL:", deleteUrl); // For debugging the constructed URL
      const res = await apiDelete(deleteUrl);
      if (res.success) {
        setToast({ message: "Image deleted successfully.", isError: false });
        // Split imagePath into username and filename
        const [username, filename] = imagePath.split("/");
        setGalleryItems(
          galleryItems.filter(
            (item) =>
              !(item.username === username && item.filename === filename)
          )
        );
      } else {
        setToast({ message: res.error, isError: true });
      }
    }
  };

  // -------------------------------
  // Lightbox functions.
  const openLightbox = (index) => {
    setLightbox({ isOpen: true, currentIndex: index });
  };
  const closeLightbox = () => {
    setLightbox({ isOpen: false, currentIndex: 0 });
  };
  const nextImage = () => {
    setLightbox((prev) => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % filteredItems.length,
    }));
  };
  const prevImage = () => {
    setLightbox((prev) => ({
      ...prev,
      currentIndex:
        (prev.currentIndex - 1 + filteredItems.length) % filteredItems.length,
    }));
  };

  // Fullscreen toggle for lightbox.
  const toggleFullScreen = () => {
    if (lightboxRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        lightboxRef.current.requestFullscreen().catch((err) => {
          console.error("Error enabling full-screen:", err);
        });
      }
    }
  };

  // -------------------------------
  // Sorting & Filtering
  const sortedItems = [...galleryItems].sort((a, b) => {
    if (sortOption === "newest") {
      return new Date(b.timestamp) - new Date(a.timestamp);
    } else if (sortOption === "oldest") {
      return new Date(a.timestamp) - new Date(b.timestamp);
    } else if (sortOption === "mostLikes") {
      return (b.likeCount || 0) - (a.likeCount || 0);
    } else if (sortOption === "leastLikes") {
      return (a.likeCount || 0) - (b.likeCount || 0);
    }
    return 0;
  });

  let filteredItems = sortedItems.filter((item) =>
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  if (selectedTags.length > 0) {
    filteredItems = filteredItems.filter((item) =>
      selectedTags.every((tag) => item.tags && item.tags.includes(tag))
    );
  }

  // -------------------------------
  // Keyboard controls for lightbox.
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightbox.isOpen) return;
      if (e.key === "ArrowRight") nextImage();
      else if (e.key === "ArrowLeft") prevImage();
      else if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightbox.isOpen, filteredItems]);

  // -------------------------------
  // Download, Share, and Like functions.
  const downloadImage = async (imgUrl) => {
    try {
      const response = await fetch(imgUrl, { mode: "cors" });
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = imgUrl.substring(imgUrl.lastIndexOf("/") + 1);
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  const shareImage = (imgUrl) => {
    fetch(imgUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const fileName = imgUrl.substring(imgUrl.lastIndexOf("/") + 1);
        const file = new File([blob], fileName, { type: blob.type });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          navigator
            .share({
              files: [file],
              title: "Check out this image!",
              text: "I found this amazing image on ImaginAI!",
            })
            .then(() => console.log("Image shared successfully"))
            .catch((error) => console.error("Error sharing image:", error));
        } else {
          alert("Sharing not supported. Copying link instead.");
          navigator.clipboard.writeText(imgUrl);
        }
      })
      .catch((error) =>
        console.error("Error fetching image for sharing:", error)
      );
  };

  const updateLike = async (imageId) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/like/${imageId}`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      setGalleryItems((prev) =>
        prev.map((item) =>
          item.filename === imageId
            ? { ...item, likeCount: data.likeCount }
            : item
        )
      );
    } catch (err) {
      console.error("Error updating like:", err);
    }
  };

  // -------------------------------
  // Comments Functions.
  const loadComments = async (imageId) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/get-comments/${imageId}`, {
        credentials: "include",
      });
      const data = await res.json();
      setComments((prev) => ({ ...prev, [imageId]: data.comments || [] }));
    } catch (err) {
      console.error("Error loading comments:", err);
    }
  };

  const submitComment = async (imageId) => {
    const commentText = newComment[imageId] ? newComment[imageId].trim() : "";
    if (commentText === "") return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/comment/${imageId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: commentText }),
        credentials: "include",
      });
      const data = await res.json();
      if (data.commentCount !== undefined) {
        await loadComments(imageId);
        setNewComment((prev) => ({ ...prev, [imageId]: "" }));
      }
    } catch (err) {
      console.error("Error submitting comment:", err);
    }
  };

  const toggleCommentOverlay = (imageId) => {
    setOpenCommentOverlays((prev) => ({
      ...prev,
      [imageId]: !prev[imageId],
    }));
    if (!openCommentOverlays[imageId]) loadComments(imageId);
  };

  // -------------------------------
  // Toggle favorite using a Star icon.
  const toggleFavorite = (filename) => {
    setFavorites((prev) => {
      let updated = prev.includes(filename)
        ? prev.filter((f) => f !== filename)
        : [...prev, filename];
      localStorage.setItem("favorites", JSON.stringify(updated));
      return updated;
    });
  };

  // -------------------------------
  // Extract unique tags from gallery items.
  const allTags = Array.from(
    new Set(galleryItems.flatMap((item) => item.tags || []))
  );

  // -------------------------------
  // Theme toggle handler.
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div
      className={`min-h-screen ${
        theme === "dark"
          ? "bg-gradient-to-br from-black via-gray-900 to-black"
          : "bg-gray-100"
      } pt-24 px-4 relative overflow-hidden`}
    >
      {/* Background Dark Blur */}
      <div className="absolute inset-0 bg-black opacity-70 filter blur-3xl z-0"></div>
      {/* Sparkles Background */}
      <div className="absolute inset-0 sparkles-animation z-[1] pointer-events-none"></div>

      <div className="relative z-10">
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.1 }}
              className="p-2 rounded-full bg-black/40 text-white"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </motion.button>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
              <input
                type="text"
                placeholder="Search images..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-4 pl-12 rounded-xl bg-black/50 border border-white/10 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 text-white placeholder-white/60 backdrop-blur-xl transition-all"
                aria-label="Search images by description"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="p-3 rounded-xl bg-black/50 border border-white/10 text-white focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 backdrop-blur-xl transition-all"
              aria-label="Sort images"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="mostLikes">Most Likes</option>
              <option value="leastLikes">Least Likes</option>
            </select>
            {/* Tags Filter */}
            <div className="flex items-center gap-2">
              {allTags.map((tag) => (
                <motion.button
                  key={tag}
                  onClick={() =>
                    setSelectedTags((prev) =>
                      prev.includes(tag)
                        ? prev.filter((t) => t !== tag)
                        : [...prev, tag]
                    )
                  }
                  whileHover={{ scale: 1.1 }}
                  className={`px-3 py-1 rounded-full border transition-colors ${
                    selectedTags.includes(tag)
                      ? "bg-purple-500 text-white"
                      : "bg-transparent text-white border-white/20"
                  }`}
                  aria-label={`Filter by tag ${tag}`}
                >
                  {tag}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold mb-12 text-center bg-gradient-to-r from-black to-amber-400 bg-clip-text text-transparent"
        >
          My Image Gallery
        </motion.h1>

        {/* Gallery Grid using a standard grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => {
              const imageUrl = `${BACKEND_URL}/static/gallery/${item.username}/${item.filename}`;
              return (
                <motion.div
                  key={item.filename}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative bg-black/30 rounded-2xl overflow-hidden border border-white/10 backdrop-blur-lg hover:border-purple-500 transition-all duration-300"
                >
                  {/* Image Container without glowing skeleton */}
                  <div
                    className="relative cursor-zoom-in"
                    onClick={() => openLightbox(index)}
                  >
                    <img
                      src={imageUrl}
                      alt={item.filename}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500"
                    />
                    {/* Top Overlay Actions */}
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 hover:opacity-100 transition-all duration-300">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          downloadImage(imageUrl);
                        }}
                        className="p-2 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 text-white"
                        aria-label="Download image"
                      >
                        <Download className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDelete(`${item.username}/${item.filename}`);
                        }}
                        className="p-2 rounded-full bg-black/40 backdrop-blur-md hover:bg-red-600/60 text-white"
                        aria-label="Delete image"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          shareImage(imageUrl);
                        }}
                        className="p-2 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 text-white"
                        aria-label="Share image"
                      >
                        <Share2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Card Info Section */}
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-3">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateLike(item.filename)}
                          className="flex items-center gap-1 text-white hover:text-pink-400"
                          aria-label="Like image"
                        >
                          <Heart className="w-5 h-5" />
                          <span>{item.likeCount || 0}</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleCommentOverlay(item.filename)}
                          className="flex items-center gap-1 text-white hover:text-blue-400"
                          aria-label="View comments"
                        >
                          <MessageCircle className="w-5 h-5" />
                          <span>{item.commentCount || 0}</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(item.filename);
                          }}
                          className="flex items-center gap-1 text-white"
                          aria-label="Mark as favorite"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              favorites.includes(item.filename)
                                ? "fill-yellow-500"
                                : "stroke-current"
                            }`}
                          />
                        </motion.button>
                      </div>
                      <div className="text-xs text-white/60">
                        by {item.username}
                      </div>
                    </div>
                    <p className="text-sm text-white/80 line-clamp-2">
                      {item.description}
                    </p>
                    {item.timestamp && (
                      <p className="text-xs text-white/40 mt-1">
                        {item.timestamp}
                      </p>
                    )}
                  </div>

                  {/* Comment Overlay */}
                  <AnimatePresence>
                    {openCommentOverlays[item.filename] && (
                      <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        className="absolute inset-0 bg-black/95 backdrop-blur-xl text-white p-4 flex flex-col"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-lg font-semibold">Comments</h3>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => toggleCommentOverlay(item.filename)}
                            aria-label="Close comments"
                          >
                            <X className="w-6 h-6" />
                          </motion.button>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-3 mb-3">
                          {comments[item.filename] &&
                          comments[item.filename].length > 0 ? (
                            comments[item.filename].map((c, idx) => (
                              <div
                                key={idx}
                                className="bg-black/40 rounded p-2"
                              >
                                <span className="font-medium text-purple-400">
                                  {c.username}
                                </span>
                                <p className="text-white/80 mt-1">
                                  {c.comment}
                                </p>
                              </div>
                            ))
                          ) : (
                            <p className="text-white/40 text-center italic">
                              No comments yet.
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add a comment..."
                            value={newComment[item.filename] || ""}
                            onChange={(e) =>
                              setNewComment((prev) => ({
                                ...prev,
                                [item.filename]: e.target.value,
                              }))
                            }
                            className="flex-1 px-3 py-2 rounded bg-black/50 border border-white/10 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 text-white placeholder-white/40"
                            aria-label="Add a comment"
                          />
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => submitComment(item.filename)}
                            className="px-3 py-2 bg-purple-500 hover:bg-purple-600 rounded flex items-center gap-1 text-white"
                            aria-label="Send comment"
                          >
                            <Send className="w-4 h-4" />
                            <span>Send</span>
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-16 text-center"
            >
              <div className="bg-black/30 rounded-2xl p-8 backdrop-blur-3xl border border-white/10 max-w-md mx-auto">
                <ImageIcon className="w-16 h-16 mx-auto mb-4 text-white/40" />
                <h2 className="text-2xl font-bold text-white/90 mb-2">
                  Your Gallery is Empty
                </h2>
                <p className="text-white/60 mb-6">
                  Start creating amazing images with our AI generator!
                </p>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Create Now
                </motion.a>
              </div>
            </motion.div>
          )}
        </div>

        {/* Enhanced Lightbox Modal */}
        <AnimatePresence>
          {lightbox.isOpen && filteredItems[lightbox.currentIndex] && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-50 p-8 flex flex-col items-center justify-center"
              ref={lightboxRef}
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={closeLightbox}
                className="absolute top-8 right-8 p-2 text-white/60 hover:text-white"
                aria-label="Close lightbox"
              >
                <X className="w-8 h-8" />
              </motion.button>
              <div className="relative">
                <motion.img
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  src={`${BACKEND_URL}/static/gallery/${
                    filteredItems[lightbox.currentIndex].username
                  }/${filteredItems[lightbox.currentIndex].filename}`}
                  alt="Full Size"
                  className="max-w-4xl max-h-[80vh] rounded-lg"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={prevImage}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 text-white"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-8 h-8" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={nextImage}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 text-white"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-8 h-8" />
                </motion.button>
                {/* Fullscreen and Edit buttons */}
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleFullScreen}
                    className="p-2 rounded-full bg-black/40 text-white"
                    aria-label="Toggle fullscreen"
                  >
                    🔍
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() =>
                      alert("Image editing functionality goes here.")
                    }
                    className="p-2 rounded-full bg-black/40 text-white"
                    aria-label="Edit image"
                  >
                    ✎
                  </motion.button>
                </div>
              </div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-white/80 mt-4 text-center max-w-2xl"
              >
                {filteredItems[lightbox.currentIndex].description}
              </motion.p>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() =>
                  shareImage(
                    `${BACKEND_URL}/static/gallery/${
                      filteredItems[lightbox.currentIndex].username
                    }/${filteredItems[lightbox.currentIndex].filename}`
                  )
                }
                className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white"
                aria-label="Share image"
              >
                Share
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {toast && <Toast {...toast} onClose={() => setToast(null)} />}

        <footer className="mt-16 py-6 text-center text-white/40 border-t border-white/5">
          <p>&copy; 2025 ImaginAI. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default Gallery;
