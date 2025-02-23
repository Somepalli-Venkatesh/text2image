import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, ArrowRight } from "lucide-react";
import anime from "animejs";
import { apiPost } from "../utils/api";
import Toast from "./Toast";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Particle Canvas Creator
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
      canvas.style.zIndex = "1";
      container.appendChild(canvas);

      const ctx = canvas.getContext("2d");
      const particles = [];

      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
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

      for (let i = 0; i < 150; i++) {
        particles.push(new Particle());
      }

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((particle) => {
          particle.update();
          particle.draw();
        });
        requestAnimationFrame(animate);
      };

      animate();
    };

    // Shapes Creator
    const createShapes = (containerClass) => {
      const shapesContainer = document.querySelector(containerClass);
      if (shapesContainer) {
        const shapeCount = 15;
        for (let i = 0; i < shapeCount; i++) {
          const shape = document.createElement("div");
          shape.classList.add("shape");
          shape.style.position = "absolute";
          shape.style.width = `${Math.random() * 100 + 50}px`;
          shape.style.height = shape.style.width;
          shape.style.left = `${Math.random() * 100}vw`;
          shape.style.top = `${Math.random() * 100}%`;
          shapesContainer.appendChild(shape);
        }
      }
    };

    // Initialize Background Effects
    createParticleCanvas(".background-animation");
    createShapes(".floating-shapes");

    // (Optional) Additional anime.js animations can be added here
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await apiPost("/forgot-password", { email });
    if (res.error) {
      setToast({ message: res.error, isError: true });
    } else {
      setToast({ message: res.message, isError: false });
      navigate(`/reset-password?email=${encodeURIComponent(email)}`);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Background Animation Layers */}
      <div className="background-animation absolute inset-0 opacity-40" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/50 to-black opacity-80" />
      <div className="floating-shapes absolute inset-0" />

      {/* Forgot Password Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl p-8 border border-white/10">
          <div className="flex flex-col items-center space-y-3 mb-8">
            <div className="p-3 bg-white/10 rounded-full">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Password Recovery</h1>
            <p className="text-gray-400 text-center">
              Enter your email to receive a password reset link
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm text-gray-400">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-4 pl-12 bg-white/5 border border-gray-600 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                />
                <Mail className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              className="group w-full p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-medium hover:bg-opacity-90 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2"
            >
              <span>Reset Password</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center justify-center space-x-1"
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

export default ForgotPassword;
