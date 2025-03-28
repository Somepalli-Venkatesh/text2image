import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import anime from "animejs";

const Home = () => {
  const navigate = useNavigate();
  // Simulated user login status; replace with your auth logic (e.g., context or redux)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const navToGenerator = () => {
    if (isLoggedIn) {
      navigate("/generator");
    } else {
      // If not logged in, show the login modal
      setShowLoginModal(true);
    }
  };

  const handleLogin = () => {
    // Simulate login success - replace with your actual login functionality
    setIsLoggedIn(true);
    setShowLoginModal(false);
    // Optionally navigate immediately after login:
    navigate("/generator");
  };

  useEffect(() => {
    // Create particle canvas for both main and footer
    const createParticleCanvas = (containerClass) => {
      const canvas = document.createElement("canvas");
      canvas.classList.add("particle-canvas");
      canvas.style.position = "absolute";
      canvas.style.top = "0";
      canvas.style.left = "0";
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.zIndex = "1";
      document.querySelector(containerClass).appendChild(canvas);

      const ctx = canvas.getContext("2d");
      const particles = [];

      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height =
          containerClass === ".background-animation"
            ? window.innerHeight
            : document.querySelector("footer").offsetHeight;
      };

      window.addEventListener("resize", resizeCanvas);
      resizeCanvas();

      // Particle class
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

      // Create particles
      for (
        let i = 0;
        i < (containerClass === ".background-animation" ? 150 : 75);
        i++
      ) {
        particles.push(new Particle());
      }

      // Animation loop
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

    // Create and animate shapes
    const createShapes = (containerClass) => {
      const shapesContainer = document.querySelector(containerClass);
      if (shapesContainer) {
        const shapeCount = containerClass === ".floating-shapes" ? 15 : 8;
        for (let i = 0; i < shapeCount; i++) {
          const shape = document.createElement("div");
          shape.classList.add("shape");
          shape.style.width = `${Math.random() * 100 + 50}px`;
          shape.style.height = shape.style.width;
          shape.style.left = `${Math.random() * 100}vw`;
          shape.style.top = `${Math.random() * 100}%`;
          shapesContainer.appendChild(shape);
        }
      }
    };

    // Initialize animations for both main and footer
    createParticleCanvas(".background-animation");
    createParticleCanvas(".footer-animation");
    createShapes(".floating-shapes");
    createShapes(".footer-shapes");

    // Animate title
    anime
      .timeline({
        easing: "easeOutExpo",
      })
      .add({
        targets: ".title span",
        translateY: [-100, 0],
        opacity: [0, 1],
        duration: 1200,
        delay: anime.stagger(100),
      });

    // Animate description
    anime({
      targets: ".description",
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 1500,
      delay: 800,
      easing: "easeOutExpo",
    });

    // Animate CTA button
    anime({
      targets: ".cta-button",
      scale: [0.9, 1],
      opacity: [0, 1],
      duration: 1000,
      delay: 1200,
      easing: "easeOutElastic(1, .5)",
    });

    // Animate footer elements
    anime({
      targets: ".footer-content",
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 1000,
      delay: anime.stagger(100),
      easing: "easeOutExpo",
    });
  }, []);

  return (
    <>
      <main className="relative min-h-screen pt-20 flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black text-white">
        {/* Background Animation Container */}
        <div className="background-animation absolute inset-0 opacity-40" />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/50 to-black opacity-80" />

        {/* Floating Shapes */}
        <div className="floating-shapes absolute inset-0" />

        {/* Content Container */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Title */}
            <h1 className="title mb-8">
              {"Transform Your Ideas Into Reality"
                .split(" ")
                .map((word, index) => (
                  <span
                    key={index}
                    className="inline-block opacity-0 mx-1 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300"
                  >
                    {word}
                  </span>
                ))}
            </h1>

            {/* Description */}
            <p className="description opacity-0 text-lg sm:text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Experience the next generation of creative possibilities with our
              cutting-edge platform. Create, innovate, and inspire.
            </p>

            {/* CTA Button */}
            <button
              onClick={navToGenerator}
              className="cta-button opacity-0 glass-morphism px-8 py-4 text-lg font-medium rounded-full transition-all duration-300 hover:bg-white/10 hover:scale-105 active:scale-95 backdrop-blur-md bg-white/10"
            >
              Get Started
            </button>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
              {[
                "Advanced Technology",
                "Seamless Integration",
                "Premium Support",
              ].map((feature, index) => (
                <div
                  key={index}
                  className="glass-morphism p-6 rounded-2xl transform hover:scale-105 transition-all duration-300 backdrop-blur-md bg-white/5 border border-white/10"
                >
                  <h3 className="text-xl font-semibold mb-2">{feature}</h3>
                  <p className="text-gray-400">
                    Experience the future of innovation with our cutting-edge
                    solutions.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 max-w-sm w-full">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            <p className="mb-4">Please log in to access the generator.</p>
            {/* Replace with your actual login form */}
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => setShowLoginModal(false)}
              className="w-full mt-2 border border-gray-300 py-2 rounded hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Enhanced Footer with Animations */}
      <footer className="relative bg-gradient-to-br from-black via-gray-900 to-black text-gray-400 py-12 overflow-hidden">
        {/* Footer Background Animation */}
        <div className="footer-animation absolute inset-0 opacity-30" />

        {/* Footer Shapes */}
        <div className="footer-shapes absolute inset-0" />

        {/* Footer Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Newsletter Subscription */}
          <div className="footer-content mb-12 text-center glass-morphism p-8 rounded-2xl">
            <h3 className="text-white text-2xl font-semibold mb-4">
              Subscribe to Our Newsletter
            </h3>
            <p className="mb-4">
              Stay updated with the latest news, articles, and
              resources—delivered to your inbox weekly.
            </p>
            <form className="flex flex-col sm:flex-row justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full sm:w-auto px-4 py-2 rounded-l sm:rounded-l-md border border-gray-600 bg-black/50 text-white focus:outline-none backdrop-blur-md"
              />
              <button
                type="submit"
                className="mt-4 sm:mt-0 sm:ml-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-r sm:rounded-r-md transition-colors duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Footer Links */}
          <div className="footer-content grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Company Section */}
            <div className="glass-morphism p-6 rounded-xl">
              <h4 className="text-white text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/about"
                    className="hover:text-white transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/careers"
                    className="hover:text-white transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="/blog"
                    className="hover:text-white transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="/press"
                    className="hover:text-white transition-colors"
                  >
                    Press
                  </a>
                </li>
              </ul>
            </div>

            {/* Products Section */}
            <div className="glass-morphism p-6 rounded-xl">
              <h4 className="text-white text-lg font-semibold mb-4">
                Products
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/features"
                    className="hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="/pricing"
                    className="hover:text-white transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="/solutions"
                    className="hover:text-white transition-colors"
                  >
                    Solutions
                  </a>
                </li>
                <li>
                  <a
                    href="/demo"
                    className="hover:text-white transition-colors"
                  >
                    Request a Demo
                  </a>
                </li>
              </ul>
            </div>

            {/* Support Section */}
            <div className="glass-morphism p-6 rounded-xl">
              <h4 className="text-white text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/help"
                    className="hover:text-white transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="/docs"
                    className="hover:text-white transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="/community"
                    className="hover:text-white transition-colors"
                  >
                    Community
                  </a>
                </li>
                <li>
                  <a href="/faq" className="hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal Section */}
            <div className="glass-morphism p-6 rounded-xl">
              <h4 className="text-white text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/terms"
                    className="hover:text-white transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="/cookie"
                    className="hover:text-white transition-colors"
                  >
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Section */}
            <div className="glass-morphism p-6 rounded-xl">
              <h4 className="text-white text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2">
                <li>
                  Email:{" "}
                  <a
                    href="mailto:contact@vvit.com"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    contact@vvit.com
                  </a>
                </li>
                <li>
                  Phone:{" "}
                  <a
                    href="tel:+1234567890"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    +1 (234) 567-890
                  </a>
                </li>
                <li>Address: 1234 Street Name, City, State, Country</li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="footer-content mt-12 border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} VVIT. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a
                href="https://twitter.com/vvit"
                className="hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter
              </a>
              <a
                href="https://linkedin.com/company/vvit"
                className="hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
              <a
                href="https://facebook.com/vvit"
                className="hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>
              <a
                href="https://instagram.com/vvit"
                className="hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Home;
