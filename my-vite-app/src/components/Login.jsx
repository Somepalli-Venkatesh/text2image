import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, Lock, ArrowRight } from "lucide-react";
import { apiPost } from "../utils/api";
import Toast from "./Toast";

function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await apiPost("/", form);
    if (res.error) {
      setToast({ message: res.error, isError: true });
    } else {
      localStorage.setItem("username", res.username);
      navigate("/home");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black text-white px-4"
    >
      {/* Background Layers */}
      <div className="background-animation absolute inset-0 opacity-40" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/50 to-black opacity-80" />
      <div className="floating-shapes absolute inset-0" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-md z-10"
      >
        {/* Neon Card Glow */}
        <div className="absolute inset-0 -z-10 rounded-2xl bg-black/50 border border-purple-700 shadow-[0_0_20px_rgba(128,0,128,0.8),0_0_40px_rgba(128,128,128,0.8)]" />
        {/* Extra Neon Gradient Overlay */}
        <div className="absolute -inset-0.5 -z-20 rounded-2xl bg-gradient-to-r from-purple-600 via-gray-800 to-black blur opacity-60" />

        <div className="p-8 md:p-10">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-3 drop-shadow-[0_0_10px_rgba(128,0,128,0.8)]">
              Welcome Back
            </h1>
            <p className="text-white/60">Sign in to your account to continue</p>
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
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  name="username"
                  id="username"
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-purple-700 focus:ring-2 focus:ring-purple-700 text-white placeholder-white/40 transition-all"
                  placeholder="Enter your username or email"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white/80"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="password"
                  name="password"
                  id="password"
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-purple-700 focus:ring-2 focus:ring-purple-700 text-white placeholder-white/40 transition-all"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-700 to-gray-700 hover:from-purple-800 hover:to-gray-800 rounded-lg text-white font-medium shadow-[0_0_10px_rgba(128,0,128,0.8)] flex items-center justify-center gap-2 group transition-all"
            >
              Sign In
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.form>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 space-y-4"
          >
            <div className="flex items-center justify-center gap-2 text-sm text-white/60">
              <span>Don't have an account?</span>
              <Link
                to="/register"
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
              >
                Create account
              </Link>
            </div>

            <Link
              to="/forgot-password"
              className="block text-center text-sm text-white/60 hover:text-white/80 transition-colors"
            >
              Forgot your password?
            </Link>
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </motion.div>
  );
}

export default Login;
