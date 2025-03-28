import React, { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { LockKeyhole, Key, ShieldCheck, ArrowRight } from "lucide-react";
import { apiPost } from "../utils/api";
import Toast from "./Toast";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const [form, setForm] = useState({ otp: "", new_password: "" });
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await apiPost("/reset-password", { email, ...form });
    if (res.error) {
      setToast({ message: res.error, isError: true });
    } else {
      setToast({ message: res.message, isError: false });
      navigate("/login");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-emerald-900 via-teal-900 to-cyan-900">
      {/* Animated background icons */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute animate-float opacity-5 top-20 left-20">
          <Key size={80} className="text-white" />
        </div>
        <div className="absolute animate-float-delayed opacity-5 bottom-20 right-20">
          <ShieldCheck size={80} className="text-white" />
        </div>
      </div>

      <div className="relative w-full max-w-md mx-4 animate-fade-in">
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl p-8 border border-white/10">
          <div className="flex flex-col items-center space-y-3 mb-8">
            <div className="p-3 bg-white/10 rounded-full">
              <LockKeyhole className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Reset Password</h1>
            <p className="text-emerald-200/70 text-center">
              Enter your OTP and new password
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input type="hidden" name="email" value={email} />

            <div className="space-y-2">
              <label
                htmlFor="otp"
                className="block text-sm text-emerald-200/70"
              >
                Enter OTP
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="otp"
                  value={form.otp}
                  onChange={handleChange}
                  required
                  maxLength={6}
                  className="w-full p-4 pl-12 bg-white/5 border border-emerald-700/30 rounded-xl text-white placeholder:text-emerald-200/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-transparent transition-all duration-200"
                  placeholder="Enter 6-digit OTP"
                />
                <Key className="w-5 h-5 text-emerald-200/50 absolute left-4 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="new_password"
                className="block text-sm text-emerald-200/70"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="new_password"
                  value={form.new_password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  className="w-full p-4 pl-12 bg-white/5 border border-emerald-700/30 rounded-xl text-white placeholder:text-emerald-200/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-transparent transition-all duration-200"
                  placeholder="Enter new password"
                />
                <LockKeyhole className="w-5 h-5 text-emerald-200/50 absolute left-4 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              className="group w-full p-4 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-xl text-white font-medium hover:opacity-90 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2"
            >
              <span>Reset Password</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-emerald-200/70 hover:text-white transition-colors duration-200 flex items-center justify-center space-x-1"
            >
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}

export default ResetPassword;
