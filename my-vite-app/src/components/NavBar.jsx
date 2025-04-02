// components/NavBar.jsx
import React, { useState, useRef, useEffect } from "react";
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
  Settings,
  BarChart2,
  Info,
} from "lucide-react";
import logo from "../assets/Vtext.png";

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showAccuracy, setShowAccuracy] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const username = localStorage.getItem("username");
  const dropdownRef = useRef(null);

  // Close dropdown if clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Hide the navbar on these pages
  if (
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/reset-password" ||
    location.pathname === "/forgot-password"
  ) {
    return null;
  }

  // Modified logout handler navigates to home page
  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    localStorage.removeItem("username");
    navigate("/");
  };

  // Handle protected navigation
  const handleProtectedNavigation = (e, path) => {
    if (!username) {
      e.preventDefault();
      setShowLoginModal(true);
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-20 bg-gray-900 bg-opacity-90 backdrop-blur-xl z-50 border-b border-white/10">
        <div className="container mx-auto px-4 h-full">
          <div className="flex justify-between items-center h-full">
            {/* Logo Section */}
            <Link
              to="/"
              className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-blue to-amber-600 bg-clip-text text-transparent transition-all ease-in-out duration-300 hover:shadow-md"
            >
              <img src={logo} alt="Logo" className="h-20 w-auto" />
              VisioText
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className="nav-link group flex items-center gap-2 text-gray-300 transition-all ease-in-out duration-300 hover:text-white hover:border-b-2 hover:border-amber-500"
              >
                <Home size={18} />
                <span>Home</span>
              </Link>
              <Link
                to="/team"
                className="nav-link group flex items-center gap-2 text-gray-300 transition-all ease-in-out duration-300 hover:text-white hover:border-b-2 hover:border-amber-500"
              >
                <Users size={18} />
                <span>Team</span>
              </Link>
              <Link
                to="/gallery"
                onClick={(e) => handleProtectedNavigation(e, "/gallery")}
                className="nav-link group flex items-center gap-2 text-gray-300 transition-all ease-in-out duration-300 hover:text-white hover:border-b-2 hover:border-amber-500"
              >
                <Image size={18} />
                <span>Gallery</span>
              </Link>
              <Link
                to="/generator"
                onClick={(e) => handleProtectedNavigation(e, "/generator")}
                className="nav-link group flex items-center gap-2 text-gray-300 transition-all ease-in-out duration-300 hover:text-white hover:border-b-2 hover:border-amber-500"
              >
                <Camera size={18} />
                <span>Generator</span>
              </Link>
              <Link
                to="/contact"
                className="nav-link group flex items-center gap-2 text-gray-300 transition-all ease-in-out duration-300 hover:text-white hover:border-b-2 hover:border-amber-500"
              >
                <Mail size={18} />
                <span>Contact</span>
              </Link>
              <Link
                to="/about"
                className="nav-link group flex items-center gap-2 text-gray-300 transition-all ease-in-out duration-300 hover:text-white hover:border-b-2 hover:border-amber-500"
              >
                <Info size={18} />
                <span>About</span>
              </Link>
            </div>

            {/* Desktop Auth Section */}
            <div
              className="hidden md:flex items-center gap-4 relative"
              ref={dropdownRef}
            >
              {username ? (
                <>
                  <div className="flex items-center gap-2">
                    <Link
                      to="/settings"
                      className="p-2 rounded-full bg-gray-900 hover:bg-gray-800 transition"
                    >
                      <Settings size={20} className="text-gray-300" />
                    </Link>
                    <button
                      onClick={() => setShowAccuracy(!showAccuracy)}
                      className="p-2 rounded-full bg-gray-900 hover:bg-gray-800 transition"
                    >
                      <BarChart2
                        size={18}
                        className={
                          showAccuracy ? "text-amber-500" : "text-gray-300"
                        }
                      />
                    </button>
                    {showAccuracy && (
                      <Link
                        to="/accuracy"
                        className="nav-link group flex items-center gap-1 text-gray-300 transition-all ease-in-out duration-300 hover:text-white hover:border-b-2 hover:border-amber-500"
                      >
                        <span>Accuracy</span>
                      </Link>
                    )}
                  </div>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 p-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg transition"
                  >
                    <User size={20} className="text-white" />
                    <span className="text-white text-sm font-medium">
                      {username}
                    </span>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-3 w-56 transform transition-all duration-300 origin-top-right">
                      <div className="absolute right-4 -top-2">
                        <svg
                          className="w-4 h-4 text-gray-800"
                          viewBox="0 0 16 8"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M0 0L8 8L16 0H0Z" />
                        </svg>
                      </div>
                      <div className="w-56 bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg shadow-lg border border-gray-700 z-50">
                        <div className="py-3 px-4 border-b border-gray-700 text-center">
                          <p className="text-base font-medium text-white">
                            {username}
                          </p>
                        </div>
                        <Link
                          to="/profile"
                          className="flex items-center justify-center gap-2 block text-center py-2 px-4 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                        >
                          <User size={16} className="text-gray-300" />
                          <span>Profile</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center justify-center gap-2 w-full text-center py-2 px-4 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                        >
                          <LogOut size={16} className="text-gray-300" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 transition-all ease-in-out duration-300 hover:bg-white/10 hover:text-white text-gray-300"
                  >
                    <LogIn size={16} />
                    <span className="hidden sm:inline">Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all ease-in-out duration-300 hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    <UserPlus size={16} />
                    <span className="hidden sm:inline">Register</span>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Auth Section */}
            <div className="flex md:hidden items-center gap-4">
              {username ? (
                <>
                  <Link
                    to="/settings"
                    className="p-2 rounded-full bg-gray-900 hover:bg-gray-800 transition"
                  >
                    <Settings size={20} className="text-gray-300" />
                  </Link>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 p-2 rounded-full bg-gray-900 hover:bg-gray-800 transition"
                  >
                    <User size={20} className="text-blue-400" />
                    <span className="text-white text-sm font-medium">
                      {username}
                    </span>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-4 top-16 bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg shadow-lg border border-gray-700 z-50 w-48">
                      <Link
                        to="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-center gap-2 block text-center py-2 px-4 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                      >
                        <User size={16} className="text-gray-300" />
                        <span>Profile</span>
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="flex items-center justify-center gap-2 w-full text-center py-2 px-4 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                      >
                        <LogOut size={16} className="text-gray-300" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 transition-all ease-in-out duration-300 hover:bg-white/10 hover:text-white text-gray-300"
                  >
                    <LogIn size={16} />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all ease-in-out duration-300 hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    <UserPlus size={16} />
                    <span>Register</span>
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
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 text-gray-300 transition-all ease-in-out duration-300 hover:text-white hover:border-b-2 hover:border-amber-500"
          >
            <Home size={18} />
            <span>Home</span>
          </Link>
          <Link
            to="/team"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 text-gray-300 transition-all ease-in-out duration-300 hover:text-white hover:border-b-2 hover:border-amber-500"
          >
            <Users size={18} />
            <span>Team</span>
          </Link>
          <Link
            to="/gallery"
            onClick={(e) => {
              handleProtectedNavigation(e, "/gallery");
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2 text-gray-300 transition-all ease-in-out duration-300 hover:text-white hover:border-b-2 hover:border-amber-500"
          >
            <Image size={18} />
            <span>Gallery</span>
          </Link>
          <Link
            to="/generator"
            onClick={(e) => {
              handleProtectedNavigation(e, "/generator");
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2 text-gray-300 transition-all ease-in-out duration-300 hover:text-white hover:border-b-2 hover:border-amber-500"
          >
            <Camera size={18} />
            <span>Generator</span>
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 text-gray-300 transition-all ease-in-out duration-300 hover:text-white hover:border-b-2 hover:border-amber-500"
          >
            <Mail size={18} />
            <span>Contact</span>
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 text-gray-300 transition-all ease-in-out duration-300 hover:text-white hover:border-b-2 hover:border-amber-500"
          >
            <Info size={18} />
            <span>About</span>
          </Link>
          <Link
            to="/accuracy"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 text-gray-300 transition-all ease-in-out duration-300 hover:text-white hover:border-b-2 hover:border-amber-500"
          >
            <BarChart2 size={18} />
            <span>Accuracy</span>
          </Link>
        </div>
      )}

      {/* Login Modal with Dark Theme */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-11/12 max-w-sm text-center">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">
              Access Denied
            </h2>
            <p className="mb-6 text-gray-300">
              Please login first to access this page.
            </p>
            <button
              onClick={() => setShowLoginModal(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default NavBar;
