// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import anime from "animejs";
// import { apiPost } from "../utils/api";
// import Toast from "./Toast";
// import ImageEditor from "./ImageEditor";
// import {
//   Download,
//   Trash2,
//   Share2,
//   Search,
//   ChevronLeft,
//   ChevronRight,
//   Star,
//   Wand2,
//   Sparkles,
//   Image as ImageIcon,
// } from "lucide-react";

// // -------------------
// // Helper: Download Image
// // -------------------
// const downloadImage = (dataUrl) => {
//   const link = document.createElement("a");
//   link.href = dataUrl;
//   link.download = "generated_image.png";
//   link.click();
// };

// const Generator = () => {
//   const [prompt, setPrompt] = useState("");
//   const [generatedImage, setGeneratedImage] = useState(null);
//   const [toast, setToast] = useState(null);
//   const [history, setHistory] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const navigate = useNavigate();
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const imageContainerRef = useRef(null);
//   const [isEditing, setIsEditing] = useState(false);

//   // Add this at the beginning of the Generator component or in a useEffect
//   useEffect(() => {
//     // Check if user is logged in
//     const username = sessionStorage.getItem("username");
//     if (!username) {
//       setToast({
//         message: "Please log in to generate and upload images",
//         isError: true,
//       });
//       navigate("/login");
//     }
//   }, [navigate]);

//   // Fetch generation history
//   useEffect(() => {
//     const fetchHistory = async () => {
//       try {
//         const response = await fetch("/api/history", {
//           credentials: "include",
//         });
//         const data = await response.json();
//         if (data.success) {
//           setHistory(data.history);
//         }
//       } catch (error) {
//         console.error("Error fetching history:", error);
//       }
//     };
//     fetchHistory();
//   }, []);

//   // Background Animations
//   useEffect(() => {
//     const createParticleCanvas = (containerClass) => {
//       const container = document.querySelector(containerClass);
//       if (!container) return;
//       const canvas = document.createElement("canvas");
//       canvas.classList.add("particle-canvas");
//       canvas.style.position = "absolute";
//       canvas.style.top = "0";
//       canvas.style.left = "0";
//       canvas.style.width = "100%";
//       canvas.style.height = "100%";
//       canvas.style.zIndex = "0";
//       container.appendChild(canvas);

//       const ctx = canvas.getContext("2d");
//       const particles = [];

//       const resizeCanvas = () => {
//         canvas.width = container.offsetWidth;
//         canvas.height = container.offsetHeight;
//       };

//       window.addEventListener("resize", resizeCanvas);
//       resizeCanvas();

//       function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
//         let rot = (Math.PI / 2) * 3;
//         let x = cx;
//         let y = cy;
//         const step = Math.PI / spikes;
//         ctx.beginPath();
//         ctx.moveTo(cx, cy - outerRadius);
//         for (let i = 0; i < spikes; i++) {
//           x = cx + Math.cos(rot) * outerRadius;
//           y = cy + Math.sin(rot) * outerRadius;
//           ctx.lineTo(x, y);
//           rot += step;
//           x = cx + Math.cos(rot) * innerRadius;
//           y = cy + Math.sin(rot) * innerRadius;
//           ctx.lineTo(x, y);
//           rot += step;
//         }
//         ctx.lineTo(cx, cy - outerRadius);
//         ctx.closePath();
//         ctx.fill();
//       }

//       class Particle {
//         constructor() {
//           this.reset();
//         }
//         reset() {
//           this.x = Math.random() * canvas.width;
//           this.y = Math.random() * canvas.height;
//           this.size = Math.random() * 2 + 1;
//           this.speed = Math.random() * 1.5 + 0.5;
//           this.color = `rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`;
//           this.direction = Math.random() * Math.PI * 2;
//         }
//         update() {
//           this.x += Math.cos(this.direction) * this.speed;
//           this.y += Math.sin(this.direction) * this.speed;
//           if (
//             this.x < 0 ||
//             this.x > canvas.width ||
//             this.y < 0 ||
//             this.y > canvas.height
//           ) {
//             this.reset();
//           }
//         }
//         draw() {
//           ctx.fillStyle = this.color;
//           drawStar(ctx, this.x, this.y, 5, this.size * 2, this.size);
//         }
//       }

//       for (let i = 0; i < 100; i++) {
//         particles.push(new Particle());
//       }

//       const animate = () => {
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//         particles.forEach((p) => {
//           p.update();
//           p.draw();
//         });
//         requestAnimationFrame(animate);
//       };

//       animate();
//     };

//     const createShapes = (containerClass) => {
//       const container = document.querySelector(containerClass);
//       if (!container) return;
//       const shapeCount = 10;
//       for (let i = 0; i < shapeCount; i++) {
//         const shape = document.createElement("div");
//         shape.classList.add("shape");
//         shape.style.position = "absolute";
//         const size = Math.random() * 80 + 30;
//         shape.style.width = `${size}px`;
//         shape.style.height = `${size}px`;
//         shape.style.background = "rgba(255,255,255,0.1)";
//         shape.style.borderRadius = "50%";
//         shape.style.left = `${Math.random() * 100}vw`;
//         shape.style.top = `${Math.random() * 100}vh`;
//         container.appendChild(shape);
//       }
//     };

//     createParticleCanvas(".background-animation");
//     createShapes(".floating-shapes");

//     anime({
//       targets: ".shape",
//       translateX: () => anime.random(-50, 50),
//       translateY: () => anime.random(-50, 50),
//       scale: [1, 1.1],
//       opacity: [0.1, 0.3],
//       duration: () => anime.random(3000, 5000),
//       easing: "easeInOutSine",
//       direction: "alternate",
//       loop: true,
//       delay: () => anime.random(0, 1000),
//     });
//   }, []);

//   // Generation function with simulated progress
//   const generateImage = async () => {
//     if (!prompt.trim()) {
//       setToast({ message: "Please enter a description", isError: true });
//       return;
//     }
//     setIsLoading(true);
//     setProgress(0);
//     const progressInterval = setInterval(() => {
//       setProgress((prev) => (prev < 90 ? prev + 10 : prev));
//     }, 300);
//     try {
//       const res = await apiPost("/generate-image", { prompt });
//       clearInterval(progressInterval);
//       setProgress(100);
//       if (res.success) {
//         setGeneratedImage(res.imageUrl);
//         setToast({ message: "Image generated successfully!", isError: false });
//       } else {
//         setToast({ message: res.error, isError: true });
//       }
//     } catch (error) {
//       clearInterval(progressInterval);
//       setToast({
//         message: "Failed to generate image. Please try again.",
//         isError: true,
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Convert a data URL to a Blob
//   const dataURLtoBlob = (dataURL) => {
//     const arr = dataURL.split(",");
//     const mime = arr[0].match(/:(.*?);/)[1];
//     const bstr = atob(arr[1]);
//     let n = bstr.length;
//     const u8arr = new Uint8Array(n);
//     while (n--) {
//       u8arr[n] = bstr.charCodeAt(n);
//     }
//     return new Blob([u8arr], { type: mime });
//   };

//   const uploadImage = async () => {
//     if (!generatedImage) return;
//     try {
//       const blob = dataURLtoBlob(generatedImage);
//       const formData = new FormData();
//       formData.append("image", blob, "generated_image.png");
//       formData.append("description", prompt);

//       const res = await fetch("/api/upload", {
//         method: "POST",
//         body: formData,
//         credentials: "include",
//       });

//       // Check if unauthorized
//       if (res.status === 401) {
//         setToast({
//           message: "You need to log in to upload images",
//           isError: true,
//         });
//         navigate("/login");
//         return;
//       }

//       // Check content type before parsing JSON
//       const contentType = res.headers.get("content-type");
//       if (!contentType || !contentType.includes("application/json")) {
//         console.error("Received non-JSON response:", await res.text());
//         setToast({
//           message: "Server returned an unexpected response format",
//           isError: true,
//         });
//         return;
//       }

//       const data = await res.json();
//       if (data.success) {
//         setToast({ message: "Image uploaded to gallery!", isError: false });
//         navigate("/gallery");
//       } else {
//         setToast({ message: data.error || "Upload failed", isError: true });
//       }
//     } catch (error) {
//       console.error("Upload error:", error);
//       setToast({ message: "Upload failed. Please try again.", isError: true });
//     }
//   };

//   const toggleFullScreen = () => {
//     if (imageContainerRef.current) {
//       if (document.fullscreenElement) {
//         document.exitFullscreen();
//       } else {
//         imageContainerRef.current.requestFullscreen().catch((err) => {
//           console.error("Error enabling full-screen:", err);
//         });
//       }
//     }
//   };

//   const toggleFavorite = () => {
//     const storedFavorites = JSON.parse(
//       localStorage.getItem("favoriteGenerated") || "[]"
//     );
//     let updated;
//     if (storedFavorites.includes(generatedImage)) {
//       updated = storedFavorites.filter((f) => f !== generatedImage);
//       setToast({ message: "Removed from favorites", isError: false });
//     } else {
//       updated = [...storedFavorites, generatedImage];
//       setToast({ message: "Added to favorites", isError: false });
//     }
//     localStorage.setItem("favoriteGenerated", JSON.stringify(updated));
//   };

//   // -------------------------
//   // Render: Switch between Generator view and Changes view
//   // -------------------------
//   if (isEditing) {
//     // Changes view with the ImageEditor and a back arrow
//     return (
//       <div className="relative min-h-screen bg-gradient-to-br from-black via-blue-900 to-gray-800 overflow-hidden">
//         <div className="background-animation absolute inset-0 opacity-30"></div>
//         <div className="floating-shapes absolute inset-0"></div>
//         {/* Back Arrow */}
//         <div className="absolute top-4 left-4 z-20">
//           <motion.button
//             onClick={() => setIsEditing(false)}
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//             className="p-2 rounded-full bg-white/20 backdrop-blur-xl border border-white/20 text-white hover:bg-white/30 transition-colors"
//             title="Back to Generator"
//           >
//             <ChevronLeft className="w-6 h-6" />
//           </motion.button>
//         </div>
//         <div className="pt-20 px-8 max-w-4xl mx-auto relative z-10">
//           <ImageEditor
//             imageSrc={generatedImage}
//             onSave={(editedImage) => {
//               setGeneratedImage(editedImage);
//               setIsEditing(false);
//             }}
//             onCancel={() => setIsEditing(false)}
//           />
//           <motion.button
//             onClick={uploadImage}
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20"
//           >
//             <span className="flex items-center justify-center gap-2">
//               <Share2 className="w-5 h-5" />
//               Share with the World
//             </span>
//           </motion.button>
//         </div>
//         {toast && <Toast {...toast} onClose={() => setToast(null)} />}
//       </div>
//     );
//   } else {
//     // Generator view
//     return (
//       <div className="relative min-h-screen bg-gradient-to-br from-black via-blue-900 to-gray-800 overflow-hidden">
//         <div className="background-animation absolute inset-0 opacity-30"></div>
//         <div className="floating-shapes absolute inset-0"></div>
//         <AnimatePresence>
//           {sidebarOpen && (
//             <motion.aside
//               initial={{ x: -320, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               exit={{ x: -320, opacity: 0 }}
//               transition={{ type: "spring", damping: 25, stiffness: 120 }}
//               className="fixed left-0 top-16 w-80 h-[calc(100vh-4rem)] bg-gray-900/40 backdrop-blur-xl p-6 border-r border-white/10 z-10 overflow-y-auto"
//             >
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-2xl px-3 pt-10 font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
//                   Generation History
//                 </h2>
//                 <motion.button
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={() => setSidebarOpen(false)}
//                   className="p-2 rounded-full hover:bg-white/10"
//                 >
//                   {/* <X className="w-5 h-5 text-white/70" /> */}
//                 </motion.button>
//               </div>
//               <motion.ul layout className="space-y-3">
//                 <AnimatePresence>
//                   {history.length > 0 ? (
//                     history.map((entry) => (
//                       <motion.li
//                         key={entry._id}
//                         layout
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -20 }}
//                         className="group relative p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300"
//                       >
//                         <p className="text-white/80 text-sm">
//                           {entry.description}
//                         </p>
//                         <motion.button
//                           whileHover={{ scale: 1.1 }}
//                           whileTap={{ scale: 0.9 }}
//                           onClick={() => deleteHistory(entry._id)}
//                           className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-400"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </motion.button>
//                       </motion.li>
//                     ))
//                   ) : (
//                     <motion.li
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       className="text-white/60 text-center p-4"
//                     >
//                       No generation history available.
//                     </motion.li>
//                   )}
//                 </AnimatePresence>
//               </motion.ul>
//             </motion.aside>
//           )}
//         </AnimatePresence>
//         <motion.button
//           onClick={() => setSidebarOpen(!sidebarOpen)}
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//           className="fixed left-4 top-20 z-20 p-3 rounded-full bg-white/20 backdrop-blur-xl border border-white/20 text-white hover:bg-white/30 transition-colors shadow-lg"
//           title={sidebarOpen ? "Close Sidebar" : "Open Sidebar"}
//         >
//           {sidebarOpen ? (
//             <ChevronLeft className="w-6 h-6" />
//           ) : (
//             <ChevronRight className="w-6 h-6" />
//           )}
//         </motion.button>
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className={`pt-20 px-8 max-w-4xl mx-auto relative z-10 transition-all duration-300 ${
//             sidebarOpen ? "ml-80" : "ml-8"
//           }`}
//         >
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-center mb-12"
//           >
//             <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
//               Transform Text into Art
//             </h1>
//             <p className="text-lg text-white/60">
//               Unleash your imagination and create stunning visuals with AI
//             </p>
//           </motion.div>
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10 mb-8"
//           >
//             <label
//               htmlFor="text-input"
//               className="block mb-4 text-lg text-white/80 font-medium"
//             >
//               Enter your imagination:
//             </label>
//             <textarea
//               id="text-input"
//               className="w-full p-4 rounded-xl bg-white/5 border border-white/10 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 text-white/90 transition-all duration-300 resize-none placeholder-white/30"
//               rows="6"
//               placeholder="Describe anything you can imagine..."
//               value={prompt}
//               onChange={(e) => setPrompt(e.target.value)}
//             />
//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={generateImage}
//               disabled={isLoading}
//               className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl text-white font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/20"
//             >
//               {isLoading ? (
//                 <span className="flex items-center justify-center gap-2">
//                   <svg
//                     className="animate-spin h-5 w-5 text-white"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     />
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                     />
//                   </svg>
//                   <span>Generating... {progress}%</span>
//                 </span>
//               ) : (
//                 <span className="flex items-center justify-center gap-2">
//                   <Wand2 className="w-5 h-5" />
//                   <span>Generate Magic</span>
//                   <Sparkles className="w-5 h-5" />
//                 </span>
//               )}
//             </motion.button>
//           </motion.div>
//           <motion.div
//             layout
//             className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10"
//           >
//             {generatedImage ? (
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.95 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 className="space-y-6"
//               >
//                 <div ref={imageContainerRef} className="relative group">
//                   <img
//                     src={generatedImage}
//                     alt="Generated"
//                     className="w-full rounded-xl shadow-2xl transition-transform duration-300 group-hover:scale-[1.01]"
//                   />
//                   <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                     <motion.button
//                       whileHover={{ scale: 1.1 }}
//                       whileTap={{ scale: 0.9 }}
//                       onClick={toggleFullScreen}
//                       className="p-2.5 rounded-xl bg-black/40 backdrop-blur-xl border border-white/20 text-white hover:bg-black/60 transition-colors"
//                       title="View Fullscreen"
//                     >
//                       <Search className="w-5 h-5" />
//                     </motion.button>
//                     <motion.button
//                       whileHover={{ scale: 1.1 }}
//                       whileTap={{ scale: 0.9 }}
//                       onClick={toggleFavorite}
//                       className="p-2.5 rounded-xl bg-black/40 backdrop-blur-xl border border-white/20 text-white hover:bg-black/60 transition-colors"
//                       title="Add to Favorites"
//                     >
//                       <Star
//                         className={`w-5 h-5 ${
//                           JSON.parse(
//                             localStorage.getItem("favoriteGenerated") || "[]"
//                           ).includes(generatedImage)
//                             ? "fill-yellow-500"
//                             : "stroke-current"
//                         }`}
//                       />
//                     </motion.button>
//                     <motion.button
//                       whileHover={{ scale: 1.1 }}
//                       whileTap={{ scale: 0.9 }}
//                       onClick={() => downloadImage(generatedImage)}
//                       className="p-2.5 rounded-xl bg-black/40 backdrop-blur-xl border border-white/20 text-white hover:bg-black/60 transition-colors"
//                       title="Download Image"
//                     >
//                       <Download className="w-5 h-5" />
//                     </motion.button>
//                   </div>
//                 </div>
//                 <div className="flex flex-col gap-4 mt-4">
//                   <motion.button
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                     onClick={uploadImage}
//                     className="w-full px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20"
//                   >
//                     <span className="flex items-center justify-center gap-2">
//                       <Share2 className="w-5 h-5" />
//                       Share with the World
//                     </span>
//                   </motion.button>
//                   <motion.button
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                     onClick={() => setIsEditing(true)}
//                     className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
//                   >
//                     Make Changes
//                   </motion.button>
//                 </div>
//               </motion.div>
//             ) : (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="text-center py-16"
//               >
//                 <ImageIcon className="w-16 h-16 mx-auto mb-4 text-white/20" />
//                 <p className="text-white/40 text-lg">
//                   Your masterpiece awaits! Start by describing what you'd like
//                   to create.
//                 </p>
//               </motion.div>
//             )}
//           </motion.div>
//         </motion.div>
//         {toast && <Toast {...toast} onClose={() => setToast(null)} />}
//       </div>
//     );
//   }
// };

// export default Generator;

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import anime from "animejs";
import { apiPost, apiGet } from "../utils/api";
import Toast from "./Toast";
import ImageEditor from "./ImageEditor";
import {
  Download,
  Trash2,
  Share2,
  Search,
  ChevronLeft,
  ChevronRight,
  Star,
  Wand2,
  Sparkles,
  Image as ImageIcon,
} from "lucide-react";

// -------------------
// Helper: Download Image
// -------------------
const downloadImage = (dataUrl) => {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = "generated_image.png";
  link.click();
};

const Generator = () => {
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState(null);
  const [toast, setToast] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const imageContainerRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const username = sessionStorage.getItem("username");
    if (!username) {
      setToast({
        message: "Please log in to generate and upload images",
        isError: true,
      });
      navigate("/login");
    }
  }, [navigate]);

  // Fetch generation history using the API utility function
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await apiGet("/history");
        if (data.success) {
          setHistory(data.history);
        }
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };
    fetchHistory();
  }, []);

  // Background Animations
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

      function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
        let rot = (Math.PI / 2) * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;
        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
          x = cx + Math.cos(rot) * outerRadius;
          y = cy + Math.sin(rot) * outerRadius;
          ctx.lineTo(x, y);
          rot += step;
          x = cx + Math.cos(rot) * innerRadius;
          y = cy + Math.sin(rot) * innerRadius;
          ctx.lineTo(x, y);
          rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.fill();
      }

      class Particle {
        constructor() {
          this.reset();
        }
        reset() {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          this.size = Math.random() * 2 + 1;
          this.speed = Math.random() * 1.5 + 0.5;
          this.color = `rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`;
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
          ctx.fillStyle = this.color;
          drawStar(ctx, this.x, this.y, 5, this.size * 2, this.size);
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
      scale: [1, 1.1],
      opacity: [0.1, 0.3],
      duration: () => anime.random(3000, 5000),
      easing: "easeInOutSine",
      direction: "alternate",
      loop: true,
      delay: () => anime.random(0, 1000),
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

      // Use your API utility function here
      const res = await apiPost("/upload", formData, true); // Note: using "/upload" as the endpoint
      // Check if unauthorized
      if (res.error && res.error === "Unauthorized access") {
        setToast({
          message: "You need to log in to upload images",
          isError: true,
        });
        navigate("/login");
        return;
      }

      // Since apiPost returns JSON, we can process it here
      if (res.success) {
        setToast({ message: "Image uploaded to gallery!", isError: false });
        navigate("/gallery");
      } else {
        setToast({ message: res.error || "Upload failed", isError: true });
      }
    } catch (error) {
      console.error("Upload error:", error);
      setToast({ message: "Upload failed. Please try again.", isError: true });
    }
  };

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

  // -------------------------
  // Render: Switch between Generator view and Changes view
  // -------------------------
  if (isEditing) {
    // Changes view with the ImageEditor and a back arrow
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-black via-blue-900 to-gray-800 overflow-hidden">
        <div className="background-animation absolute inset-0 opacity-30"></div>
        <div className="floating-shapes absolute inset-0"></div>
        {/* Back Arrow */}
        <div className="absolute top-4 left-4 z-20">
          <motion.button
            onClick={() => setIsEditing(false)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full bg-white/20 backdrop-blur-xl border border-white/20 text-white hover:bg-white/30 transition-colors"
            title="Back to Generator"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>
        </div>
        <div className="pt-20 px-8 max-w-4xl mx-auto relative z-10">
          <ImageEditor
            imageSrc={generatedImage}
            onSave={(editedImage) => {
              setGeneratedImage(editedImage);
              setIsEditing(false);
            }}
            onCancel={() => setIsEditing(false)}
          />
          <motion.button
            onClick={uploadImage}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20"
          >
            <span className="flex items-center justify-center gap-2">
              <Share2 className="w-5 h-5" />
              Share with the World
            </span>
          </motion.button>
        </div>
        {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      </div>
    );
  } else {
    // Generator view
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-black via-blue-900 to-gray-800 overflow-hidden">
        <div className="background-animation absolute inset-0 opacity-30"></div>
        <div className="floating-shapes absolute inset-0"></div>
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 120 }}
              className="fixed left-0 top-16 w-80 h-[calc(100vh-4rem)] bg-gray-900/40 backdrop-blur-xl p-6 border-r border-white/10 z-10 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl px-3 pt-10 font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Generation History
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-full hover:bg-white/10"
                >
                  {/* <X className="w-5 h-5 text-white/70" /> */}
                </motion.button>
              </div>
              <motion.ul layout className="space-y-3">
                <AnimatePresence>
                  {history.length > 0 ? (
                    history.map((entry) => (
                      <motion.li
                        key={entry._id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="group relative p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300"
                      >
                        <p className="text-white/80 text-sm">
                          {entry.description}
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => deleteHistory(entry._id)}
                          className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </motion.li>
                    ))
                  ) : (
                    <motion.li
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-white/60 text-center p-4"
                    >
                      No generation history available.
                    </motion.li>
                  )}
                </AnimatePresence>
              </motion.ul>
            </motion.aside>
          )}
        </AnimatePresence>
        <motion.button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed left-4 top-20 z-20 p-3 rounded-full bg-white/20 backdrop-blur-xl border border-white/20 text-white hover:bg-white/30 transition-colors shadow-lg"
          title={sidebarOpen ? "Close Sidebar" : "Open Sidebar"}
        >
          {sidebarOpen ? (
            <ChevronLeft className="w-6 h-6" />
          ) : (
            <ChevronRight className="w-6 h-6" />
          )}
        </motion.button>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`pt-20 px-8 max-w-4xl mx-auto relative z-10 transition-all duration-300 ${
            sidebarOpen ? "ml-80" : "ml-8"
          }`}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Transform Text into Art
            </h1>
            <p className="text-lg text-white/60">
              Unleash your imagination and create stunning visuals with AI
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10 mb-8"
          >
            <label
              htmlFor="text-input"
              className="block mb-4 text-lg text-white/80 font-medium"
            >
              Enter your imagination:
            </label>
            <textarea
              id="text-input"
              className="w-full p-4 rounded-xl bg-white/5 border border-white/10 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 text-white/90 transition-all duration-300 resize-none placeholder-white/30"
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
              className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl text-white font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/20"
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
                  <Wand2 className="w-5 h-5" />
                  <span>Generate Magic</span>
                  <Sparkles className="w-5 h-5" />
                </span>
              )}
            </motion.button>
          </motion.div>
          <motion.div
            layout
            className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10"
          >
            {generatedImage ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div ref={imageContainerRef} className="relative group">
                  <img
                    src={generatedImage}
                    alt="Generated"
                    className="w-full rounded-xl shadow-2xl transition-transform duration-300 group-hover:scale-[1.01]"
                  />
                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={toggleFullScreen}
                      className="p-2.5 rounded-xl bg-black/40 backdrop-blur-xl border border-white/20 text-white hover:bg-black/60 transition-colors"
                      title="View Fullscreen"
                    >
                      <Search className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={toggleFavorite}
                      className="p-2.5 rounded-xl bg-black/40 backdrop-blur-xl border border-white/20 text-white hover:bg-black/60 transition-colors"
                      title="Add to Favorites"
                    >
                      <Star
                        className={`w-5 h-5 ${
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
                      className="p-2.5 rounded-xl bg-black/40 backdrop-blur-xl border border-white/20 text-white hover:bg-black/60 transition-colors"
                      title="Download Image"
                    >
                      <Download className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
                <div className="flex flex-col gap-4 mt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={uploadImage}
                    className="w-full px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Share2 className="w-5 h-5" />
                      Share with the World
                    </span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsEditing(true)}
                    className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
                  >
                    Make Changes
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <ImageIcon className="w-16 h-16 mx-auto mb-4 text-white/20" />
                <p className="text-white/40 text-lg">
                  Your masterpiece awaits! Start by describing what you'd like
                  to create.
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
        {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      </div>
    );
  }
};

export default Generator;
