import React, { useEffect, useState } from "react";
import anime from "animejs";
import {
  Info,
  FileText,
  BookOpen,
  File,
  ArrowDownCircle,
  CheckCircle,
  X,
  Users,
  GitBranch,
  Globe,
  Server,
  ExternalLink,
  Save,
  Zap,
  Code,
  Calendar,
} from "lucide-react";

const AboutSection = () => {
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Animate elements on mount
    anime({
      targets: ".about-animation",
      translateY: [20, 0],
      opacity: [0, 1],
      delay: anime.stagger(100),
      duration: 800,
      easing: "easeOutExpo",
    });

    // Create interactive particle background
    const createParticleCanvas = () => {
      const canvas = document.createElement("canvas");
      canvas.classList.add("particle-canvas");
      canvas.style.position = "absolute";
      canvas.style.top = "0";
      canvas.style.left = "0";
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.zIndex = "1";
      document.querySelector(".about-container").appendChild(canvas);
      const ctx = canvas.getContext("2d");

      let mouseX = 0,
        mouseY = 0;
      canvas.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      });

      // Global flag for card hover (set in React below)
      window.cardHovered = false;

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
          this.baseColor = `rgba(255,255,255,${Math.random() * 0.5 + 0.1})`;
          this.color = this.baseColor;
          this.direction = Math.random() * Math.PI * 2;
        }
        update() {
          const angleToMouse = Math.atan2(mouseY - this.y, mouseX - this.x);
          this.direction = this.direction * 0.95 + angleToMouse * 0.05;
          this.x += Math.cos(this.direction) * this.speed;
          this.y += Math.sin(this.direction) * this.speed;
          if (window.cardHovered) {
            this.color = `rgba(255,100,150,${Math.random() * 0.8 + 0.2})`;
          } else {
            this.color = this.baseColor;
          }
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
        particles.forEach((p) => {
          p.update();
          p.draw();
        });
        requestAnimationFrame(animate);
      };

      animate();
    };

    createParticleCanvas();

    return () => {
      const canvas = document.querySelector(".particle-canvas");
      if (canvas) canvas.remove();
      window.removeEventListener("resize", () => {});
    };
  }, []);

  const handleDownload = (cardTitle) => {
    setToast(`Downloading ${cardTitle}.pdf`);
    setTimeout(() => setToast(null), 3000);
  };

  // Navigation tabs
  const tabs = [
    { id: "overview", title: "Overview" },
    { id: "team", title: "Our Team" },
    { id: "technology", title: "Technology" },
    { id: "downloads", title: "Downloads" },
  ];

  // Deployment Cards Data
  const deploymentCards = [
    {
      id: "frontend",
      title: "Frontend",
      icon: <Globe className="w-8 h-8 text-gray-300 mr-2" />,
      description:
        "Our frontend application is deployed on Vercel, providing fast and reliable access to the user interface.",
      platform: "Vercel",
      url: "https://vercel.com/",
      gradient: "from-blue-500 to-cyan-600",
      border: "border-blue-500",
    },
    {
      id: "backend",
      title: "Backend",
      icon: <Server className="w-8 h-8 text-gray-300 mr-2" />,
      description:
        "The backend is hosted on Render, ensuring stable and scalable server operations.",
      platform: "Render",
      url: "https://render.com",
      gradient: "from-purple-500 to-pink-600",
      border: "border-purple-500",
    },
  ];

  // Download Cards Data
  const cards = [
    {
      id: "abstract",
      title: "Abstract",
      icon: <FileText className="w-8 h-8 text-gray-300 mr-2" />,
      description:
        "A brief summary of our project's objectives and key findings, presented in a concise abstract.",
      buttonText: "Download Abstract",
      buttonIcon: <ArrowDownCircle className="w-5 h-5 mr-2 animate-pulse" />,
      gradient: "from-blue-500 to-indigo-600",
      border: "border-blue-500",
      href: "https://drive.google.com/uc?export=download&id=1LEQwZadJemRlzmsY1wItZlRktMXtxXcz",
      filename: "Abstract.pdf",
    },
    {
      id: "journal",
      title: "Journal",
      icon: <BookOpen className="w-8 h-8 text-gray-300 mr-2" />,
      description:
        "Detailed articles and insights documenting our project progress, milestones, and outcomes.",
      buttonText: "Download Journal",
      buttonIcon: <ArrowDownCircle className="w-5 h-5 mr-2 animate-pulse" />,
      gradient: "from-green-500 to-teal-600",
      border: "border-green-500",
      href: "https://drive.google.com/uc?export=download&id=1_lRxWaJ8XeTtsqVUzpHBWPzUZugse1g8",
      filename: "Journal.pdf",
    },
    {
      id: "document",
      title: "Document",
      icon: <File className="w-8 h-8 text-gray-300 mr-2" />,
      description:
        "Complete project documentation outlining methodologies, results, and future directions.",
      buttonText: "Download Document",
      buttonIcon: <ArrowDownCircle className="w-5 h-5 mr-2 animate-pulse" />,
      gradient: "from-purple-500 to-pink-600",
      border: "border-purple-500",
      href: "https://drive.google.com/uc?export=download&id=1o0PtNrV4eF4SOR-7FvzEWhLgXUw8Ge2z",
      filename: "Document.pdf",
    },
  ];

  // Statistics: Team Members and Commits (Centered)
  const statistics = [
    {
      icon: <Users className="w-6 h-6" />,
      value: "4",
      label: "Team Members",
      color: "text-green-400",
    },
    {
      icon: <GitBranch className="w-6 h-6" />,
      value: "50",
      label: "Commits",
      color: "text-purple-400",
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      value: "12",
      label: "Weeks",
      color: "text-blue-400",
    },
    {
      icon: <Save className="w-6 h-6" />,
      value: "250+",
      label: "Hours Invested",
      color: "text-amber-400",
    },
  ];

  // Technology Stack with enhanced descriptions - UPDATED to include Python Flask instead of Node.js
  const techStack = [
    {
      name: "React",
      icon: <Code className="w-6 h-6" />,
      description:
        "Front-end library for building dynamic user interfaces with reusable components.",
    },
    {
      name: "Tailwind CSS",
      icon: <Globe className="w-6 h-6" />,
      description:
        "Utility-first CSS framework for rapid UI development with a consistent design system.",
    },
    {
      name: "Python Flask",
      icon: <Code className="w-6 h-6" />,
      description:
        "Lightweight Python web framework for building RESTful APIs and backend services.",
    },
    {
      name: "MongoDB",
      icon: <Server className="w-6 h-6" />,
      description:
        "NoSQL database for storing and retrieving data with flexible schema design.",
    },
  ];

  // Enhanced Features with descriptions
  const features = [
    {
      title: "Responsive Design",
      description:
        "Adapts to any screen size for optimal viewing on all devices.",
    },
    {
      title: "High Performance",
      description:
        "Optimized code for fast loading and smooth user experience.",
    },
    {
      title: "Scalable Architecture",
      description:
        "Built to handle growth with maintainable and extensible codebase.",
    },
    {
      title: "User-Friendly Interface",
      description:
        "Intuitive navigation and clean design focused on user experience.",
    },
    {
      title: "Secure Data Handling",
      description:
        "Implements best security practices for protecting user information.",
    },
    // {
    //   title: "Real-time Updates",
    //   description: "Instant content updates without requiring page refreshes.",
    // },
  ];

  // Enhanced Timeline with icons for each milestone
  const timeline = [
    {
      date: "December 2024",
      title: "Project Initiation",
      description: "Initial planning, research, and team formation.",
      color: "border-blue-500",
      icon: <Zap className="w-4 h-4" />,
    },
    {
      date: "January 2025",
      title: "Development Phase",
      description: "Core features implementation and testing began.",
      color: "border-green-500",
      icon: <Code className="w-4 h-4" />,
    },
    {
      date: "February 2025",
      title: "Beta Testing",
      description: "User feedback and bug fixes refined the product.",
      color: "border-yellow-500",
      icon: <ExternalLink className="w-4 h-4" />,
    },
    {
      date: "March 2025",
      title: "Project Launch",
      description: "Official launch and deployment of the project.",
      color: "border-purple-500",
      icon: <Server className="w-4 h-4" />,
    },
  ];

  // New: Team Members section
  const teamMembers = [
    {
      name: "Venkatesh Somepalli",
      role: "Team Leader",
      bio: "B.Tech 4th year",
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      name: "Tumati Manohar",
      role: "Team Member",
      bio: "B.Tech 4th year",
      gradient: "from-green-500 to-teal-600",
    },
    {
      name: "Yetukuri Venkata Kusuma",
      role: "Team Member",
      bio: "B.Tech 4th year",
      gradient: "from-purple-500 to-pink-600",
    },
    {
      name: "Tupakula Keerthi",
      role: "Team Member",
      bio: "B.Tech 4th year",
      gradient: "from-amber-500 to-orange-600",
    },
  ];

  // New: Project Goals section
  const projectGoals = [
    "Develop an intuitive and responsive user interface",
    "Create a scalable backend architecture",
    "Implement secure user authentication and data protection",
    "Optimize performance for seamless user experience",
    "Build comprehensive documentation for future maintenance",
    "Establish a continuous integration and deployment pipeline",
  ];

  // New: Project impact metrics
  // const impactMetrics = [
  //   {
  //     metric: "40%",
  //     description: "Increase in user engagement",
  //   },
  //   {
  //     metric: "60%",
  //     description: "Faster response times",
  //   },
  //   {
  //     metric: "25%",
  //     description: "Reduction in development costs",
  //   },
  //   {
  //     metric: "90%",
  //     description: "Positive user feedback",
  //   },
  // ];

  // Render the appropriate content based on the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <>
            {/* Project Overview */}
            <div className="about-animation glass-morphism p-8 rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10 mb-16">
              <h2 className="text-2xl font-semibold mb-4">Project Overview</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                In this project, we aim to enhance the performance of DC-GANs in
                text-to-image synthesis by addressing the limitations of
                previous models, such as improving image resolution and reducing
                artifacts.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-8">Project Goals</h3>
              <ul className="list-disc pl-5 space-y-2 mb-8">
                {projectGoals.map((goal, idx) => (
                  <li key={idx} className="text-gray-300">
                    {goal}
                  </li>
                ))}
              </ul>

              {/* Impact Metrics */}
{/*               <h3 className="text-xl font-semibold mb-6">Project Impact</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {impactMetrics.map((item, idx) => (
                  <div
                    key={idx}
                    className="text-center p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10"
                  >
                    <div className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                      {item.metric}
                    </div>
                    <div className="text-sm text-gray-400 mt-2">
                      {item.description}
                    </div>
                  </div>
                ))}
              </div>*/}
            </div> 

            {/* Timeline Section */}
            <div className="about-animation mb-16">
              <h2 className="text-2xl font-semibold text-center mb-8">
                Project Timeline
              </h2>
              <div className="space-y-6">
                {timeline.map((item, index) => (
                  <div
                    key={index}
                    className={`relative pl-8 pb-6 border-l-2 ${item.color} last:pb-0`}
                  >
                    <div
                      className={`absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-current ${item.color.replace(
                        "border",
                        "text"
                      )}`}
                    >
                      {item.icon}
                    </div>
                    <div className="text-sm text-gray-400 mb-1">
                      {item.date}
                    </div>
                    <div className="text-xl font-semibold mb-2">
                      {item.title}
                    </div>
                    <div className="text-gray-300">{item.description}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Statistics Section */}
            <div className="about-animation mb-16">
              <h2 className="text-2xl font-semibold text-center mb-8">
                Project Statistics
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {statistics.map((stat, index) => (
                  <div
                    key={index}
                    className="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 text-center transform hover:scale-105 transition-transform duration-300"
                  >
                    <div className={`flex justify-center mb-3 ${stat.color}`}>
                      {stat.icon}
                    </div>
                    <div className="stat-number text-3xl font-bold mb-1">
                      {stat.value}
                    </div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Deployment Cards */}
            <div className="about-animation mb-16">
              <h2 className="text-2xl font-semibold text-center mb-8">
                Deployment
              </h2>
              <div className="grid gap-8 md:grid-cols-2">
                {deploymentCards.map((card) => (
                  <div
                    key={card.id}
                    className="glass-morphism p-6 rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  >
                    <div className="flex items-center mb-4">
                      {card.icon}
                      <h3 className="text-xl font-semibold">{card.title}</h3>
                    </div>
                    <p className="text-gray-300 mb-4">{card.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">
                        Platform: {card.platform}
                      </span>
                      <a
                        href={card.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center px-4 py-2 bg-animated-gradient ${card.gradient} rounded-lg text-white text-sm hover:opacity-90 transition-all`}
                      >
                        Visit Site
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        );

      case "team":
        return (
          <div className="about-animation">
            <h2 className="text-2xl font-semibold text-center mb-8">
              Our Team
            </h2>
            <p className="text-gray-300 text-center max-w-3xl mx-auto mb-12">
              Our project is brought to life by a talented and dedicated team of
              professionals with diverse backgrounds and expertise. Each member
              brings unique skills and perspectives to create a truly
              exceptional product.
            </p>

            <div className="grid gap-8 md:grid-cols-2">
              {teamMembers.map((member, idx) => (
                <div
                  key={idx}
                  className="glass-morphism p-8 rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-gradient-to-br ${member.gradient}`}
                  >
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <div className="text-gray-400 text-sm mb-4">
                    {member.role}
                  </div>
                  <p className="text-gray-300">{member.bio}</p>
                </div>
              ))}
            </div>

            {/* Team Values */}
            <div className="mt-16 glass-morphism p-8 rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10">
              <h3 className="text-xl font-semibold mb-6">Our Values</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-6 h-6 text-blue-400" />
                  </div>
                  <h4 className="text-lg font-medium mb-2">Innovation</h4>
                  <p className="text-gray-400 text-sm">
                    Constantly pushing boundaries and exploring new solutions.
                  </p>
                </div>
                <div className="text-center p-6">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  </div>
                  <h4 className="text-lg font-medium mb-2">Quality</h4>
                  <p className="text-gray-400 text-sm">
                    Unwavering commitment to excellence in everything we create.
                  </p>
                </div>
                <div className="text-center p-6">
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-purple-400" />
                  </div>
                  <h4 className="text-lg font-medium mb-2">Collaboration</h4>
                  <p className="text-gray-400 text-sm">
                    Working together with open communication and mutual respect.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "technology":
        return (
          <div className="about-animation">
            <h2 className="text-2xl font-semibold text-center mb-8">
              Technology Stack
            </h2>
            <p className="text-gray-300 text-center max-w-3xl mx-auto mb-12">
              Our project is built using cutting-edge technologies carefully
              selected to ensure robust performance, scalability, and an
              exceptional user experience.
            </p>

            {/* Tech Stack Cards */}
            <div className="grid gap-6 md:grid-cols-2 mb-16">
              {techStack.map((tech, idx) => (
                <div
                  key={idx}
                  className="glass-morphism p-6 rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10 transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-4">
                      {tech.icon}
                    </div>
                    <h3 className="text-xl font-semibold">{tech.name}</h3>
                  </div>
                  <p className="text-gray-300">{tech.description}</p>
                </div>
              ))}
            </div>

            {/* Architecture Diagram - UPDATED: removed authentication and external services */}
            <div className="glass-morphism p-8 rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10 mb-16">
              <h3 className="text-xl font-semibold mb-6">
                System Architecture
              </h3>
              <div className="bg-black/20 p-8 rounded-xl border border-white/5 mb-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="text-center p-4 bg-blue-500/20 rounded-lg border border-blue-500/30 mb-4">
                    <div className="font-medium mb-2">User Interface Layer</div>
                    <div className="text-sm text-gray-400">
                      React & Tailwind CSS
                    </div>
                  </div>

                  <div className="flex justify-center my-2">
                    <div className="h-8 w-0.5 bg-gray-500/50"></div>
                  </div>

                  <div className="text-center p-4 bg-purple-500/20 rounded-lg border border-purple-500/30 mb-4">
                    <div className="font-medium mb-2">Application Layer</div>
                    <div className="text-sm text-gray-400">Python Flask</div>
                  </div>

                  <div className="flex justify-center my-2">
                    <div className="h-8 w-0.5 bg-gray-500/50"></div>
                  </div>

                  <div className="text-center p-4 bg-green-500/20 rounded-lg border border-green-500/30">
                    <div className="font-medium mb-2">Database</div>
                    <div className="text-sm text-gray-400">MongoDB</div>
                  </div>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Our architecture follows a modern approach with clearly
                separated concerns and optimized data flow between components.
              </p>
            </div>

            {/* Features */}
            <h3 className="text-xl font-semibold mb-6">Key Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
                >
                  <h4 className="text-lg font-medium mb-2">{feature.title}</h4>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case "downloads":
        return (
          <div className="about-animation">
            <h2 className="text-2xl font-semibold text-center mb-4">
              Project Documents
            </h2>
            <p className="text-gray-300 text-center max-w-3xl mx-auto mb-12">
              Access comprehensive documentation to learn more about our project
              methodology, findings, and technical specifications.
            </p>

            <div className="grid gap-8 md:grid-cols-3">
              {cards.map((card) => (
                <div
                  key={card.id}
                  onMouseEnter={() => (window.cardHovered = true)}
                  onMouseLeave={() => (window.cardHovered = false)}
                  className="glass-morphism p-8 rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10 flex flex-col justify-between transition-all duration-300 hover:scale-105 hover:shadow-2xl transform-gpu hover:rotate-y-3"
                >
                  <div>
                    <div className="flex items-center mb-6">
                      {card.icon}
                      <h2 className="text-2xl font-semibold drop-shadow-sm">
                        {card.title}
                      </h2>
                    </div>
                    <p className="text-gray-300 text-base mb-6 leading-relaxed">
                      {card.description}
                    </p>
                    {/* Decorative divider */}
                    <div className="border-t border-dotted border-gray-600 my-4"></div>
                  </div>
                  <a
                    href={card.href}
                    download={card.filename}
                    onClick={() => handleDownload(card.title)}
                    className={`inline-flex items-center justify-center mt-4 px-6 py-3 bg-animated-gradient ${card.gradient} ${card.border} border-2 text-white rounded-lg shadow-lg hover:opacity-90 transition-all text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white group`}
                  >
                    <span className="group-hover:scale-110 transition-transform duration-200">
                      {card.buttonIcon}
                    </span>
                    {card.buttonText}
                  </a>
                </div>
              ))}
            </div>

            {/* Additional Resources */}
{/*             <div className="mt-16 glass-morphism p-8 rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10">
              <h3 className="text-xl font-semibold mb-6">
                Additional Resources
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a
                  href="#"
                  className="p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <FileText className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium">User Guide</div>
                    <div className="text-sm text-gray-400">
                      Comprehensive user documentation
                    </div>
                  </div>
                </a>
                <a
                  href="#"
                  className="p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <Code className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <div className="font-medium">API Documentation</div>
                    <div className="text-sm text-gray-400">
                      Technical reference for developers
                    </div>
                  </div>
                </a>
                <a
                  href="#"
                  className="p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="font-medium">Case Studies</div>
                    <div className="text-sm text-gray-400">
                      Real-world implementation examples
                    </div>
                  </div>
                </a>
                <a
                  href="#"
                  className="p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <GitBranch className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <div className="font-medium">GitHub Repository</div>
                    <div className="text-sm text-gray-400">
                      Project source code and documentation
                    </div>
                  </div>
                </a>
              </div>
            </div> */}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="about-container relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/50 to-black opacity-80" />

      {/* Toast Message - Top Right */}
      {toast && (
        <div className="fixed top-10 right-10 w-fit flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-full shadow-2xl z-50 animate-slideDown">
          <CheckCircle className="w-6 h-6" />
          <span className="font-semibold">{toast}</span>
          <button
            onClick={() => setToast(null)}
            className="ml-2 hover:text-white/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-20">
        {/* Header */}
        <div className="about-animation text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Info className="w-8 h-8 text-gray-300 mr-2" />
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 drop-shadow-lg">
              About Our Project
            </h1>
          </div>
          <p className="text-gray-300 text-lg tracking-wide max-w-2xl mx-auto">
            Explore our project's journey, from concept to implementation.
            Discover the technologies, team, and resources behind our
            innovation.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="about-animation mb-12">
          <div className="flex flex-wrap justify-center gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-full transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-white/10 text-white backdrop-blur-sm"
                    : "bg-transparent text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab.title}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        /* Animated gradient for buttons */
        .bg-animated-gradient {
          background-size: 200% 200%;
          animation: gradientShift 5s ease infinite;
        }
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        /* Slide down animation for toast */
        .animate-slideDown {
          animation: slideDown 0.5s ease forwards;
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        /* Custom hover rotation */
        .hover\\:rotate-y-3:hover {
          transform: perspective(1000px) rotateY(3deg) scale(1.05);
        }
      `}</style>
    </div>
  );
};

export default AboutSection;
