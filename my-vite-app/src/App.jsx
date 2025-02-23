import React from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
<Route path="/" element={<Generator />} />;
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Home from "./components/Home";
import Gallery from "./components/Gallery";
import Team from "./components/Team";
import Generator from "./components/Generator.jsx";
import Contact from "./components/Contact.jsx";

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <NavBar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/generator" element={<Generator />} />
        <Route path="/home" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/team" element={<Team />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
}

export default App;
