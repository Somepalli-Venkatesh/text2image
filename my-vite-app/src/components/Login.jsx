// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { User, Lock, ArrowRight } from "lucide-react";
// import { apiPost } from "../utils/api";
// import Toast from "./Toast";

// function Login() {
//   const [form, setForm] = useState({ username: "", password: "" });
//   const [toast, setToast] = useState(null);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     // Updated endpoint from "/" to "/login"
//     const res = await apiPost("/login", form);
//     if (res.error) {
//       setToast({ message: res.error, isError: true });
//     } else {
//       localStorage.setItem("username", res.username);
//       navigate("/home");
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black text-white px-4"
//     >
//       {/* Background Layers */}
//       <div className="background-animation absolute inset-0 opacity-40" />
//       <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/50 to-black opacity-80" />
//       <div className="floating-shapes absolute inset-0" />
//       <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

//       <motion.div
//         initial={{ scale: 0.95, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         transition={{ duration: 0.3 }}
//         className="relative w-full max-w-md z-10"
//       >
//         {/* Neon Card Glow */}
//         <div className="absolute inset-0 -z-10 rounded-2xl bg-black/50 border border-purple-700 shadow-[0_0_20px_rgba(128,0,128,0.8),0_0_40px_rgba(128,128,128,0.8)]" />
//         {/* Extra Neon Gradient Overlay */}
//         <div className="absolute -inset-0.5 -z-20 rounded-2xl bg-gradient-to-r from-purple-600 via-gray-800 to-black blur opacity-60" />

//         <div className="p-8 md:p-10">
//           <motion.div
//             initial={{ y: -20, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             transition={{ delay: 0.1 }}
//             className="text-center mb-8"
//           >
//             <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-3 drop-shadow-[0_0_10px_rgba(128,0,128,0.8)]">
//               Welcome Back
//             </h1>
//             <p className="text-white/60">Sign in to your account to continue</p>
//           </motion.div>

//           <motion.form
//             initial={{ y: 20, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             transition={{ delay: 0.2 }}
//             onSubmit={handleSubmit}
//             className="space-y-6"
//           >
//             <div className="space-y-1">
//               <label
//                 htmlFor="username"
//                 className="block text-sm font-medium text-white/80"
//               >
//                 Username or Email
//               </label>
//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
//                 <input
//                   type="text"
//                   name="username"
//                   id="username"
//                   onChange={handleChange}
//                   required
//                   className="w-full pl-11 pr-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-purple-700 focus:ring-2 focus:ring-purple-700 text-white placeholder-white/40 transition-all"
//                   placeholder="Enter your username or email"
//                 />
//               </div>
//             </div>

//             <div className="space-y-1">
//               <label
//                 htmlFor="password"
//                 className="block text-sm font-medium text-white/80"
//               >
//                 Password
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
//                 <input
//                   type="password"
//                   name="password"
//                   id="password"
//                   onChange={handleChange}
//                   required
//                   className="w-full pl-11 pr-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-purple-700 focus:ring-2 focus:ring-purple-700 text-white placeholder-white/40 transition-all"
//                   placeholder="Enter your password"
//                 />
//               </div>
//             </div>

//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               type="submit"
//               className="w-full py-3 px-4 bg-gradient-to-r from-purple-700 to-gray-700 hover:from-purple-800 hover:to-gray-800 rounded-lg text-white font-medium shadow-[0_0_10px_rgba(128,0,128,0.8)] flex items-center justify-center gap-2 group transition-all"
//             >
//               Sign In
//               <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//             </motion.button>
//           </motion.form>

//           <motion.div
//             initial={{ y: 20, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             transition={{ delay: 0.3 }}
//             className="mt-8 space-y-4"
//           >
//             <div className="flex items-center justify-center gap-2 text-sm text-white/60">
//               <span>Don't have an account?</span>
//               <Link
//                 to="/register"
//                 className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
//               >
//                 Create account
//               </Link>
//             </div>

//             <Link
//               to="/forgot-password"
//               className="block text-center text-sm text-white/60 hover:text-white/80 transition-colors"
//             >
//               Forgot your password?
//             </Link>
//           </motion.div>
//         </div>
//       </motion.div>

//       <AnimatePresence>
//         {toast && <Toast {...toast} onClose={() => setToast(null)} />}
//       </AnimatePresence>
//     </motion.div>
//   );
// }

// export default Login;

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, Lock, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { apiPost } from "../utils/api";
import Toast from "./Toast";
import Vtext from "../assets/VText.png";

function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiPost("/login", form);
      if (res.error) {
        setToast({ message: res.error, isError: true });
      } else {
        localStorage.setItem("username", res.username);
        sessionStorage.setItem("username", res.username);
        setToast({ message: "Logged in successfully!", isError: false });
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (error) {
      console.error(error);
      setToast({
        message: "An error occurred. Please try again.",
        isError: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black text-white px-4"
    >
      {/* Enhanced Background Effects */}
      <div className="background-animation absolute inset-0 opacity-40" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/50 to-black opacity-80" />
      <div className="floating-shapes absolute inset-0" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      {/* Animated Particle Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="stars-container"></div>
      </div>

      {/* Animated Cosmic Dust */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-purple-500"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 3 + 1,
              opacity: Math.random() * 0.5 + 0.3,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 3 + 1,
              opacity: Math.random() * 0.5 + 0.3,
            }}
            transition={{
              duration: Math.random() * 25 + 15,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50">
        <AnimatePresence>
          {toast && <Toast {...toast} onClose={() => setToast(null)} />}
        </AnimatePresence>
      </div>

      {/* Enhanced Card with Horizontal Layout */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative z-10 w-full max-w-5xl"
      >
        {/* Pulsating Outer Glow Effect */}
        <motion.div
          className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 opacity-70 blur-lg"
          animate={{
            boxShadow: [
              "0 0 20px rgba(167, 139, 250, 0.5)",
              "0 0 40px rgba(167, 139, 250, 0.7)",
              "0 0 20px rgba(167, 139, 250, 0.5)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        ></motion.div>

        {/* Main Card with Glassmorphism Effect */}
        <div className="relative rounded-2xl overflow-hidden backdrop-blur-md border border-purple-500/30">
          {/* Inner Light Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-black/80 to-black/90"></div>

          {/* Floating Sparkles (Subtle and Random) */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute z-10"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.4, 0.8, 0.4],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              <Sparkles className="w-4 h-4 text-purple-300/40" />
            </motion.div>
          ))}

          {/* Content Container with Side-by-Side Layout */}
          <div className="relative flex flex-col md:flex-row">
            {/* Left Side: Image with Enhanced Styling */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="md:w-1/2 p-8 flex items-center justify-center bg-gradient-to-br from-purple-900/20 to-black/50"
            >
              <div className="relative group">
                {/* Logo Glow Effect */}
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 opacity-0 group-hover:opacity-70 blur-md transition-opacity duration-1000"></div>

                {/* Floating Animation for Logo */}
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <img
                    src={Vtext}
                    alt="VText Logo"
                    className="relative w-full max-w-md object-contain drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-transform duration-700 group-hover:scale-105"
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Right Side: Login Form with Enhanced Styling */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="md:w-1/2 p-10 flex flex-col justify-center bg-gradient-to-br from-black/80 to-purple-900/20"
            >
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-center mb-8"
              >
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-300 to-purple-400 bg-clip-text text-transparent mb-3 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]">
                  Welcome Back
                </h1>
                <p className="text-white/60">
                  Sign in to your account to continue
                </p>
              </motion.div>

              <motion.form
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-white/80"
                  >
                    Username or Email
                  </label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-purple-400 transition-colors" />
                    <input
                      type="text"
                      name="username"
                      id="username"
                      onChange={handleChange}
                      required
                      className="w-full pl-11 pr-4 py-3 bg-black/30 border border-gray-700 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 text-white placeholder-white/40 transition-all"
                      placeholder="Enter your username or email"
                    />
                    <motion.div
                      className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600/20 to-fuchsia-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      whileHover={{ opacity: 0.2 }}
                    ></motion.div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-white/80"
                  >
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-purple-400 transition-colors" />
                    <input
                      type="password"
                      name="password"
                      id="password"
                      onChange={handleChange}
                      required
                      className="w-full pl-11 pr-4 py-3 bg-black/30 border border-gray-700 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 text-white placeholder-white/40 transition-all"
                      placeholder="Enter your password"
                    />
                    <motion.div
                      className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600/20 to-fuchsia-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      whileHover={{ opacity: 0.2 }}
                    ></motion.div>
                  </div>
                </div>

                <motion.button
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 0 15px rgba(168,85,247,0.7)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="relative w-full py-3 px-4 rounded-lg text-white font-medium shadow-[0_0_10px_rgba(168,85,247,0.5)] flex items-center justify-center gap-2 group transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600"
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{
                      duration: 15,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{ backgroundSize: "200% 200%" }}
                  />
                  <div className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <Loader2 className="animate-spin w-5 h-5" />
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </motion.button>
              </motion.form>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-8 space-y-4 text-center"
              >
                <div className="flex items-center justify-center gap-2 text-sm text-white/60">
                  <span>Don't have an account?</span>
                  <Link
                    to="/register"
                    className="text-purple-400 hover:text-purple-300 font-medium transition-colors hover:underline relative group inline-flex items-center gap-1"
                  >
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    Create account
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </div>

                <Link
                  to="/forgot-password"
                  className="block text-sm text-white/60 hover:text-white/80 transition-colors hover:underline relative group inline-flex items-center justify-center gap-1"
                >
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  Forgot your password?
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white/60 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Login;
