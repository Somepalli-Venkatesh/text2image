import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import anime from "animejs";
import { apiPost } from "../utils/api";
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
  Menu,
} from "lucide-react";

const Generator = () => {
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState(null);
  const [toast, setToast] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  // Sidebar state for toggling generation history
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Ref for full-screen image container
  const imageContainerRef = useRef(null);

  // Fetch generation history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("/api/history", {
          credentials: "include",
        });
        const data = await response.json();
        if (data.success) {
          setHistory(data.history);
        }
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };
    fetchHistory();
  }, []);

  // Background Animations (particles and shapes)
  useEffect(() => {
    const createParticleCanvas = (containerClass) => {
      const container = document.querySelector(containerClass);
      if (!container) return;
      const canvas = document.createElement("canvas");
      canvas.classList.add("particle-canvas");
      canvas.style.position = "absolute";
      canvas.style.top = "0";
      canvas.style.left = "0";
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.zIndex = "0";
      container.appendChild(canvas);

      const ctx = canvas.getContext("2d");
      const particles = [];

      const resizeCanvas = () => {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
      };

      window.addEventListener("resize", resizeCanvas);
      resizeCanvas();

      class Particle {
        constructor() {
          this.reset();
        }
        reset() {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          this.size = Math.random() * 2 + 0.5;
          this.speed = Math.random() * 1.5 + 0.5;
          this.color = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.1})`;
          this.direction = Math.random() * Math.PI * 2;
        }
        update() {
          this.x += Math.cos(this.direction) * this.speed;
          this.y += Math.sin(this.direction) * this.speed;
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
          ctx.fillStyle = this.color;
          ctx.fill();
        }
      }

      for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
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
    };

    const createShapes = (containerClass) => {
      const container = document.querySelector(containerClass);
      if (!container) return;
      const shapeCount = 10;
      for (let i = 0; i < shapeCount; i++) {
        const shape = document.createElement("div");
        shape.classList.add("shape");
        shape.style.position = "absolute";
        const size = Math.random() * 80 + 30;
        shape.style.width = `${size}px`;
        shape.style.height = `${size}px`;
        shape.style.background = "rgba(255,255,255,0.1)";
        shape.style.borderRadius = "50%";
        shape.style.left = `${Math.random() * 100}vw`;
        shape.style.top = `${Math.random() * 100}vh`;
        container.appendChild(shape);
      }
    };

    createParticleCanvas(".background-animation");
    createShapes(".floating-shapes");

    anime({
      targets: ".shape",
      translateX: () => anime.random(-50, 50),
      translateY: () => anime.random(-50, 50),
      duration: 3000,
      easing: "easeInOutSine",
      direction: "alternate",
      loop: true,
    });
  }, []);

  // Generation function with simulated progress
  const generateImage = async () => {
    if (!prompt.trim()) {
      setToast({ message: "Please enter a description", isError: true });
      return;
    }
    setIsLoading(true);
    setProgress(0);
    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + 10 : prev));
    }, 300);
    try {
      const res = await apiPost("/generate-image", { prompt });
      clearInterval(progressInterval);
      setProgress(100);
      if (res.success) {
        setGeneratedImage(res.imageUrl);
        setToast({ message: "Image generated successfully!", isError: false });
      } else {
        setToast({ message: res.error, isError: true });
      }
    } catch (error) {
      clearInterval(progressInterval);
      setToast({
        message: "Failed to generate image. Please try again.",
        isError: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Convert a data URL to a Blob
  const dataURLtoBlob = (dataURL) => {
    const arr = dataURL.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const uploadImage = async () => {
    if (!generatedImage) return;
    try {
      const blob = dataURLtoBlob(generatedImage);
      const formData = new FormData();
      formData.append("image", blob, "generated_image.png");
      formData.append("description", prompt);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setToast({ message: "Image uploaded to gallery!", isError: false });
        navigate("/gallery");
      } else {
        setToast({ message: data.error || "Upload failed", isError: true });
      }
    } catch (error) {
      setToast({ message: "Upload failed. Please try again.", isError: true });
    }
  };

  const deleteHistory = async (id) => {
    try {
      const response = await fetch(`/api/delete_history/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setHistory(history.filter((entry) => entry._id !== id));
        setToast({
          message: "History entry deleted successfully!",
          isError: false,
        });
      } else {
        setToast({ message: "Failed to delete history entry", isError: true });
      }
    } catch (error) {
      setToast({ message: "Failed to delete history entry", isError: true });
    }
  };

  // -------------------------------
  // Extra Feature: Fullscreen Toggle for Generated Image
  const toggleFullScreen = () => {
    if (imageContainerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        imageContainerRef.current.requestFullscreen().catch((err) => {
          console.error("Error enabling full-screen:", err);
        });
      }
    }
  };

  // Extra Feature: Toggle favorite for generated image (stored locally)
  const toggleFavorite = () => {
    const storedFavorites = JSON.parse(
      localStorage.getItem("favoriteGenerated") || "[]"
    );
    let updated;
    if (storedFavorites.includes(generatedImage)) {
      updated = storedFavorites.filter((f) => f !== generatedImage);
      setToast({ message: "Removed from favorites", isError: false });
    } else {
      updated = [...storedFavorites, generatedImage];
      setToast({ message: "Added to favorites", isError: false });
    }
    localStorage.setItem("favoriteGenerated", JSON.stringify(updated));
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-800 to-blue-900 overflow-hidden">
      {/* Background Animation Containers */}
      <div className="background-animation absolute inset-0 opacity-40"></div>
      <div className="floating-shapes absolute inset-0"></div>

      {/* Sidebar (conditionally rendered) */}
      {sidebarOpen && (
        <motion.aside
          initial={{ x: -320 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", damping: 20 }}
          className="fixed left-0 top-16 w-80 h-[calc(100vh-4rem)] bg-gray-900/70 backdrop-blur-xl p-6 border-r border-blue-700/50 z-10 overflow-y-auto"
        >
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Generation History
          </h2>
          <motion.ul layout className="space-y-3">
            {history.length > 0 ? (
              history.map((entry) => (
                <motion.li
                  key={entry._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="group relative p-4 bg-gray-900/60 rounded-lg border border-blue-700/50 hover:border-blue-400/70 transition-all duration-300"
                >
                  <p className="text-white/80 text-sm">{entry.description}</p>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => deleteHistory(entry._id)}
                    className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-400"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </motion.button>
                </motion.li>
              ))
            ) : (
              <li className="text-white/60 text-center p-4">
                No generation history available.
              </li>
            )}
          </motion.ul>
        </motion.aside>
      )}

      {/* Sidebar Toggle Button */}
      <motion.button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed left-2 top-20 z-20 p-2 rounded-full bg-gray-800 text-white"
        title={sidebarOpen ? "Hide History" : "Show History"}
      >
        <Menu className="w-6 h-6" />
      </motion.button>

      {/* Main Generation Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`pt-20 px-8 max-w-4xl mx-auto relative z-10 transition-all duration-300 ${
          sidebarOpen ? "ml-80" : "ml-8"
        }`}
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
        >
          Transform Text into Art
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-900/70 backdrop-blur-xl p-8 rounded-2xl border border-blue-700/50 mb-8"
        >
          <label
            htmlFor="text-input"
            className="block mb-4 text-lg text-white/80"
          >
            Enter your imagination:
          </label>
          <textarea
            id="text-input"
            className="w-full p-4 rounded-lg bg-gray-900/60 border border-blue-700/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 text-white/90 transition-all duration-300 resize-none"
            rows="6"
            placeholder="Describe anything you can imagine..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={generateImage}
            disabled={isLoading}
            className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-300 rounded-lg text-white font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Generating... {progress}%</span>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                  />
                </svg>
                Generate Magic
              </span>
            )}
          </motion.button>
        </motion.div>

        <motion.div
          layout
          className="bg-gray-900/70 backdrop-blur-xl p-8 rounded-2xl border border-blue-700/50"
        >
          {generatedImage ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div ref={imageContainerRef} className="relative">
                <img
                  src={generatedImage}
                  alt="Generated"
                  className="w-full rounded-lg"
                />
                {/* Overlay Buttons on Generated Image */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleFullScreen}
                    className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white"
                    title="View Fullscreen"
                  >
                    🔍
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() =>
                      alert("Image editing functionality goes here.")
                    }
                    className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white"
                    title="Edit Image"
                  >
                    ✎
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleFavorite}
                    className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white"
                    title="Add to Favorites"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        // For simplicity, if generatedImage is in localStorage favorites then mark as favorite.
                        JSON.parse(
                          localStorage.getItem("favoriteGenerated") || "[]"
                        ).includes(generatedImage)
                          ? "fill-yellow-500"
                          : "stroke-current"
                      }`}
                    />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => downloadImage(generatedImage)}
                    className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white"
                    title="Download Image"
                  >
                    <Download className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={uploadImage}
                className="w-full px-6 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg text-white font-medium transition-all duration-300"
              >
                <span className="flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" />
                  Share with the World
                </span>
              </motion.button>
            </motion.div>
          ) : (
            <p className="text-white/60 text-center py-12">
              Your masterpiece awaits! Start by describing what you'd like to
              create.
            </p>
          )}
        </motion.div>
      </motion.div>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Generator;
