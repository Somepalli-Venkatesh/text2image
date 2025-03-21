import React, { useState, useEffect } from "react";
import anime from "animejs";
import { Mail, Send, CheckCircle, AlertCircle } from "lucide-react";
import { apiPost } from "../utils/api";
import Toast from "./Toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  // Use toast state instead of a separate status state
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Animate form elements on mount
    anime({
      targets: ".contact-animation",
      translateY: [20, 0],
      opacity: [0, 1],
      delay: anime.stagger(100),
      duration: 800,
      easing: "easeOutExpo",
    });

    // Create particle animation (omitted for brevity)
    const createParticleCanvas = () => {
      const canvas = document.createElement("canvas");
      canvas.classList.add("particle-canvas");
      canvas.style.position = "absolute";
      canvas.style.top = "0";
      canvas.style.left = "0";
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.zIndex = "1";
      document.querySelector(".contact-container").appendChild(canvas);

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

      for (let i = 0; i < 75; i++) {
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

    createParticleCanvas();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Clear any previous toast message
    setToast(null);

    if (!formData.name || !formData.email || !formData.message) {
      setToast({
        message: "Please fill in all required fields.",
        isError: true,
      });
      return;
    }

    setLoading(true);
    try {
      // Use apiPost so the full URL and credentials are included
      const response = await apiPost("/contact", formData);
      if (response.success) {
        setToast({
          message: "Your message has been sent successfully!",
          isError: false,
        });
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
        // Optional: animate the toast message
        anime({
          targets: ".status-message",
          scale: [0.9, 1],
          opacity: [0, 1],
          duration: 600,
          easing: "easeOutElastic(1, .5)",
        });
      } else {
        setToast({
          message:
            response.error ||
            "There was an error sending your message. Please try again.",
          isError: true,
        });
      }
    } catch (error) {
      console.error(error);
      setToast({
        message: "There was an error sending your message. Please try again.",
        isError: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-container pt-20 relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/50 to-black opacity-80" />

      <div className="relative z-10 w-full max-w-lg mx-auto px-4">
        <div className="contact-animation glass-morphism rounded-2xl p-6 backdrop-blur-lg bg-white/5 border border-white/10">
          <div className="flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 mr-2 text-gray-300" />
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              Contact Us
            </h1>
          </div>

          {toast && (
            <div
              className={`status-message mb-4 p-2 rounded-lg flex items-center justify-center text-sm ${
                toast.isError ? "bg-red-500/20" : "bg-green-500/20"
              }`}
            >
              {toast.isError ? (
                <AlertCircle className="w-4 h-4 mr-2 text-red-400" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
              )}
              <span className="text-white">{toast.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="contact-animation grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-gray-300 mb-1 text-sm font-medium"
                >
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 p-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-white/20 transition-all duration-300 text-white placeholder-gray-400 text-sm"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-300 mb-1 text-sm font-medium"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 p-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-white/20 transition-all duration-300 text-white placeholder-gray-400 text-sm"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div className="contact-animation">
              <label
                htmlFor="subject"
                className="block text-gray-300 mb-1 text-sm font-medium"
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 p-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-white/20 transition-all duration-300 text-white placeholder-gray-400 text-sm"
                placeholder="What's this about?"
              />
            </div>

            <div className="contact-animation">
              <label
                htmlFor="message"
                className="block text-gray-300 mb-1 text-sm font-medium"
              >
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="3"
                className="w-full bg-white/5 border border-white/10 p-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-white/20 transition-all duration-300 text-white placeholder-gray-400 text-sm"
                placeholder="Your message here..."
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="contact-animation w-full bg-blue-600 hover:bg-blue-700 py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm text-white shadow-lg hover:shadow-blue-500/25"
            >
              {loading ? (
                "Sending..."
              ) : (
                <>
                  <span className="text-base font-semibold">Send Message</span>
                  <Send className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
