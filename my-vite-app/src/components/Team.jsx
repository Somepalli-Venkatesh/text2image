import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react";
import anime from "animejs";
import manohar from "../assets/Manohar.jpg";
const teamMembers = [
  {
    name: "Manohar",
    img: manohar,
    role: "Full Stack Developer",
    social: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
    },
  },
  {
    name: "Venkatesh",
    img: "/static/teamImages/letterV.png",
    role: "UI/UX Designer",
    social: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
    },
  },
  {
    name: "Kusuma",
    img: "/static/teamImages/letterV.png",
    role: "Backend Developer",
    social: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
    },
  },
  {
    name: "Keerthi",
    img: "/static/teamImages/letterV.png",
    role: "Full Stack Developer",
    social: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
    },
  },
];

function Team() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const containerRef = useRef(null);

  const prev = () => {
    setDirection(-1);
    setCurrentIndex(
      (currentIndex - 1 + teamMembers.length) % teamMembers.length
    );
  };

  const next = () => {
    setDirection(1);
    setCurrentIndex((currentIndex + 1) % teamMembers.length);
  };

  useEffect(() => {
    // Create sparkles
    const createSparkle = () => {
      const sparkle = document.createElement("div");
      sparkle.className = "sparkle";
      sparkle.style.position = "absolute";
      sparkle.style.width = "4px";
      sparkle.style.height = "4px";
      sparkle.style.background = "white";
      sparkle.style.borderRadius = "50%";
      sparkle.style.pointerEvents = "none";

      // Random position
      sparkle.style.left = Math.random() * 100 + "vw";
      sparkle.style.top = Math.random() * 100 + "vh";

      return sparkle;
    };

    const container = containerRef.current;
    if (!container) return;

    // Create and animate academic symbols
    const symbols = ["✏️", "📚", "🎓", "💡", "🔬", "💻", "📐", "🎨"];
    const symbolElements = [];

    symbols.forEach(() => {
      const symbol = document.createElement("div");
      symbol.className = "academic-symbol";
      symbol.style.position = "absolute";
      symbol.style.fontSize = "24px";
      symbol.style.opacity = "0.3";
      symbol.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      symbol.style.left = Math.random() * 100 + "vw";
      symbol.style.top = Math.random() * 100 + "vh";
      container.appendChild(symbol);
      symbolElements.push(symbol);
    });

    // Create sparkles
    const sparkles = Array.from({ length: 30 }, () => {
      const sparkle = createSparkle();
      container.appendChild(sparkle);
      return sparkle;
    });

    // Animate symbols
    const symbolAnimation = anime({
      targets: symbolElements,
      translateY: function () {
        return anime.random(-50, 50);
      },
      translateX: function () {
        return anime.random(-50, 50);
      },
      rotate: function () {
        return anime.random(-45, 45);
      },
      opacity: [0.2, 0.4],
      duration: function () {
        return anime.random(3000, 5000);
      },
      delay: function () {
        return anime.random(0, 1000);
      },
      direction: "alternate",
      loop: true,
      easing: "easeInOutQuad",
    });

    // Animate sparkles
    const sparkleAnimation = anime({
      targets: sparkles,
      opacity: [0, 0.8, 0],
      scale: [0, 1, 0],
      translateY: function () {
        return anime.random(-100, 100);
      },
      translateX: function () {
        return anime.random(-100, 100);
      },
      duration: function () {
        return anime.random(1000, 3000);
      },
      delay: function () {
        return anime.random(0, 2000);
      },
      loop: true,
      easing: "easeInOutQuad",
    });

    // Cleanup
    return () => {
      symbolAnimation.pause();
      sparkleAnimation.pause();
      symbolElements.forEach((el) => el?.remove());
      sparkles.forEach((el) => el?.remove());
    };
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentIndex]);

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.5,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.5,
    }),
  };

  useEffect(() => {
    const container = document.querySelector(".animated-background");
    if (!container) return;

    const canvas = document.createElement("canvas");
    canvas.classList.add("nature-canvas");
    canvas.style.position = "absolute";
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    container.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Create animated particles that look like leaves
    const particles = [];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 5 + 2,
        speedX: Math.random() * 2 - 1,
        speedY: Math.random() * 2 - 1,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 2 - 1,
        opacity: Math.random() * 0.5 + 0.3,
        hue: Math.random() * 60 + 60, // Green to yellow hues
      });
    }

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate((particle.rotation * Math.PI) / 180);
        ctx.fillStyle = `hsla(${particle.hue}, 70%, 50%, ${particle.opacity})`;

        // Draw leaf shape
        ctx.beginPath();
        ctx.moveTo(0, -particle.size);
        ctx.bezierCurveTo(
          particle.size / 2,
          -particle.size / 2,
          particle.size / 2,
          particle.size / 2,
          0,
          particle.size
        );
        ctx.bezierCurveTo(
          -particle.size / 2,
          particle.size / 2,
          -particle.size / 2,
          -particle.size / 2,
          0,
          -particle.size
        );
        ctx.fill();
        ctx.restore();

        // Update particle position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.rotation += particle.rotationSpeed;

        // Reset particle when it goes off screen
        if (particle.x < -50) particle.x = canvas.width + 50;
        if (particle.x > canvas.width + 50) particle.x = -50;
        if (particle.y < -50) particle.y = canvas.height + 50;
        if (particle.y > canvas.height + 50) particle.y = -50;
      });

      requestAnimationFrame(animateParticles);
    };

    animateParticles();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      container.removeChild(canvas);
    };
  }, []);

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-black via-gray-900 to-black pt-24 px-4 overflow-hidden">
      <div
        ref={containerRef}
        className="animated-background absolute inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.8),transparent)] pointer-events-none" />
      </div>

      <style jsx>{`
        .sparkle {
          mix-blend-mode: screen;
          filter: blur(1px);
        }

        .academic-symbol {
          pointer-events: none;
          user-select: none;
          z-index: -1;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-block px-4 py-1 rounded-full bg-gray-800/50 text-gray-400 text-sm mb-4"
        >
          Our Talented Team
        </motion.span>
        <h1 className="text-5xl font-bold text-gray-100 mb-4">Meet The Team</h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          A collective of innovative minds shaping the future of technology
        </p>
      </motion.div>

      <div className="relative w-full max-w-6xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10" />

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={prev}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-gray-800/50 border border-gray-700 backdrop-blur-sm text-gray-300 hover:bg-gray-700/50 transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={next}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-gray-800/50 border border-gray-700 backdrop-blur-sm text-gray-300 hover:bg-gray-700/50 transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>

        <div className="relative h-[500px] flex items-center justify-center overflow-hidden">
          <AnimatePresence initial={false} custom={direction}>
            {teamMembers.map((member, index) => {
              if (index !== currentIndex) return null;
              return (
                <motion.div
                  key={member.name}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  className="absolute w-full max-w-md"
                >
                  <div className="bg-gray-800/30 backdrop-blur-xl rounded-2xl p-8 border border-gray-700 shadow-2xl">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="relative w-48 h-48 mx-auto mb-6"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-gray-700 rounded-full blur-2xl opacity-20" />
                      <img
                        src={member.img}
                        alt={member.name}
                        className="relative w-full h-full rounded-full object-cover border-4 border-gray-700"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-center"
                    >
                      <h2 className="text-3xl font-bold text-gray-100 mb-2">
                        {member.name}
                      </h2>
                      <p className="text-gray-400 mb-6">{member.role}</p>

                      <div className="flex justify-center gap-4">
                        <motion.a
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          href={member.social.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-gray-700/30 hover:bg-gray-700/50 text-gray-300 hover:text-gray-100 transition-all"
                        >
                          <Github className="w-5 h-5" />
                        </motion.a>
                        <motion.a
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          href={member.social.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-gray-700/30 hover:bg-gray-700/50 text-gray-300 hover:text-gray-100 transition-all"
                        >
                          <Linkedin className="w-5 h-5" />
                        </motion.a>
                        <motion.a
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          href={member.social.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-gray-700/30 hover:bg-gray-700/50 text-gray-300 hover:text-gray-100 transition-all"
                        >
                          <Twitter className="w-5 h-5" />
                        </motion.a>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {teamMembers.map((_, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-gray-400 w-6"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Team;
