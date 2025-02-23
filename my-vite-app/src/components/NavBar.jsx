// components/NavBar.jsx
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  Image,
  Camera,
  LogOut,
  User,
  LogIn,
  UserPlus,
  Menu,
  X,
  Mail,
} from "lucide-react";
import logo from "../assets/download_logo2.png";

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const username = localStorage.getItem("username");

  // Hide the navbar on these pages
  if (
    location.pathname === "/" ||
    location.pathname === "/register" ||
    location.pathname === "/reset-password" ||
    location.pathname === "/forgot-password"
  ) {
    return null;
  }

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-20 glass-morphism backdrop-blur-xl z-50 border-b border-white/10">
        <div className="container mx-auto px-4 h-full">
          <div className="flex justify-between items-center h-full">
            {/* Logo Section */}
            <Link
              to="/"
              className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-black to-amber-600 bg-clip-text text-transparent hover:scale-105 transition-transform transition-shadow duration-200 hover:shadow-[0_0_15px_rgba(255,255,255,0.6)]"
            >
              <img src={logo} alt="Logo" className="h-10 w-auto" />
              VisioText
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/home"
                className="nav-link group flex items-center gap-2 text-gray-300 hover:text-white transition-colors transition-shadow duration-200 hover:shadow-[0_0_10px_rgba(255,255,255,0.5)]"
              >
                <Home
                  size={18}
                  className="group-hover:scale-110 transition-transform duration-200"
                />
                <span>Home</span>
              </Link>

              <Link
                to="/team"
                className="nav-link group flex items-center gap-2 text-gray-300 hover:text-white transition-colors transition-shadow duration-200 hover:shadow-[0_0_10px_rgba(255,255,255,0.5)]"
              >
                <Users
                  size={18}
                  className="group-hover:scale-110 transition-transform duration-200"
                />
                <span>Team</span>
              </Link>

              <Link
                to="/gallery"
                className="nav-link group flex items-center gap-2 text-gray-300 hover:text-white transition-colors transition-shadow duration-200 hover:shadow-[0_0_10px_rgba(255,255,255,0.5)]"
              >
                <Image
                  size={18}
                  className="group-hover:scale-110 transition-transform duration-200"
                />
                <span>Gallery</span>
              </Link>

              <Link
                to="/generator"
                className="nav-link group flex items-center gap-2 text-gray-300 hover:text-white transition-colors transition-shadow duration-200 hover:shadow-[0_0_10px_rgba(255,255,255,0.5)]"
              >
                <Camera
                  size={18}
                  className="group-hover:scale-110 transition-transform duration-200"
                />
                <span>Generator</span>
              </Link>

              <Link
                to="/contact"
                className="nav-link group flex items-center gap-2 text-gray-300 hover:text-white transition-colors transition-shadow duration-200 hover:shadow-[0_0_10px_rgba(255,255,255,0.5)]"
              >
                <Mail
                  size={18}
                  className="group-hover:scale-110 transition-transform duration-200"
                />
                <span>Contact</span>
              </Link>
            </div>

            {/* Desktop Auth Section */}
            <div className="hidden md:flex items-center gap-4">
              {username ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                    <User size={16} className="text-purple-400" />
                    <span className="text-sm font-medium bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      {username}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 text-gray-300 hover:text-white"
                  >
                    <LogOut size={16} />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/"
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 text-gray-300 hover:text-white"
                  >
                    <LogIn size={16} />
                    <span className="hidden sm:inline">Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-200 text-white"
                  >
                    <UserPlus size={16} />
                    <span className="hidden sm:inline">Register</span>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? (
                  <X size={24} className="text-gray-300" />
                ) : (
                  <Menu size={24} className="text-gray-300" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-20 left-0 right-0 bg-gray-900 bg-opacity-95 p-4 z-40 flex flex-col gap-4">
          <Link
            to="/home"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200"
          >
            <Home size={18} />
            <span>Home</span>
          </Link>
          <Link
            to="/team"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200"
          >
            <Users size={18} />
            <span>Team</span>
          </Link>
          <Link
            to="/gallery"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200"
          >
            <Image size={18} />
            <span>Gallery</span>
          </Link>
          <Link
            to="/generator"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200"
          >
            <Camera size={18} />
            <span>Generator</span>
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200"
          >
            <Mail size={18} />
            <span>Contact</span>
          </Link>

          {/* Mobile Auth Section */}
          {username ? (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <User size={16} className="text-purple-400" />
                <span className="text-sm font-medium text-gray-300">
                  {username}
                </span>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 text-gray-300 hover:text-white"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 text-gray-300 hover:text-white"
              >
                <LogIn size={16} />
                <span>Login</span>
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              >
                <UserPlus size={16} />
                <span>Register</span>
              </Link>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default NavBar;
