import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  UserPlus,
  Sparkles,
  Loader2,
} from "lucide-react";
import { apiPost } from "../utils/api";
import Toast from "./Toast";
import Vtext from "../assets/VText.png";

function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
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
      const res = await apiPost("/register", form);
      if (res.error) {
        setToast({ message: res.error, isError: true });
      } else {
        setToast({ message: "Account created! Please login.", isError: false });
        setTimeout(() => {
          navigate("/login");
        }, 1500);
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
      {/* Background Effects */}
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
              className="md:w-1/2 p-6 flex items-center justify-center bg-gradient-to-br from-purple-900/20 to-black/50"
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

            {/* Right Side: Registration Form with Enhanced Styling */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="md:w-1/2 p-6 flex flex-col justify-center bg-gradient-to-br from-black/80 to-purple-900/20"
            >
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-center mb-4"
              >
                <div className="mb-2 flex justify-center">
                  <motion.div
                    whileHover={{ rotate: 180, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className="w-12 h-12 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.7)]"
                  >
                    <UserPlus className="w-6 h-6 text-white" />
                  </motion.div>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-300 to-purple-400 bg-clip-text text-transparent mb-1 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]">
                  Create Account
                </h1>
                <p className="text-sm text-white/60">
                  Join us and start creating amazing things
                </p>
              </motion.div>

              <motion.form
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                onSubmit={handleSubmit}
                className="space-y-3"
              >
                <div className="space-y-1">
                  <label
                    htmlFor="username"
                    className="block text-xs font-medium text-white/80"
                  >
                    Username
                  </label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-purple-400 transition-colors" />
                    <input
                      type="text"
                      name="username"
                      id="username"
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-3 py-2 bg-black/30 border border-gray-700 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 text-white placeholder-white/40 transition-all"
                      placeholder="Choose your username"
                    />
                    {/* Enhanced hover effect with motion */}
                    <motion.div
                      className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600/20 to-fuchsia-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      whileHover={{ opacity: 0.2 }}
                    ></motion.div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="email"
                    className="block text-xs font-medium text-white/80"
                  >
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-purple-400 transition-colors" />
                    <input
                      type="email"
                      name="email"
                      id="email"
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-3 py-2 bg-black/30 border border-gray-700 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 text-white placeholder-white/40 transition-all"
                      placeholder="Enter your email address"
                    />
                    {/* Enhanced hover effect with motion */}
                    <motion.div
                      className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600/20 to-fuchsia-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      whileHover={{ opacity: 0.2 }}
                    ></motion.div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="password"
                    className="block text-xs font-medium text-white/80"
                  >
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-purple-400 transition-colors" />
                    <input
                      type="password"
                      name="password"
                      id="password"
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-3 py-2 bg-black/30 border border-gray-700 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 text-white placeholder-white/40 transition-all"
                      placeholder="Create a password"
                    />
                    {/* Enhanced hover effect with motion */}
                    <motion.div
                      className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600/20 to-fuchsia-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      whileHover={{ opacity: 0.2 }}
                    ></motion.div>
                  </div>
                </div>

                {/* Enhanced Button with Animated Gradient */}
                <motion.button
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 0 15px rgba(168,85,247,0.7)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="relative w-full py-2 px-4 rounded-lg text-white font-medium shadow-[0_0_10px_rgba(168,85,247,0.5)] flex items-center justify-center gap-2 group transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden mt-4"
                >
                  {/* Button background with animated gradient */}
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

                  {/* Button content */}
                  <div className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <Loader2 className="animate-spin w-4 h-4" />
                    ) : (
                      <>
                        Register
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </motion.button>
              </motion.form>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 text-center"
              >
                <div className="flex items-center justify-center gap-2 text-xs text-white/60">
                  <span>Already have an account?</span>
                  <Link
                    to="/login"
                    className="text-purple-400 hover:text-purple-300 font-medium transition-colors hover:underline relative group"
                  >
                    Login here
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Register;
