// components/Profile.jsx
import React, { useState, useEffect } from "react";
import anime from "animejs";

function Profile() {
  const username = localStorage.getItem("username");
  const [bio, setBio] = useState(
    "This is your bio. Edit it to share more about yourself."
  );
  const [editingBio, setEditingBio] = useState(false);
  const [newBio, setNewBio] = useState(bio);

  const [userEmail, setUserEmail] = useState("");
  const [editingEmail, setEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  // Fetch current user info including email from backend
  useEffect(() => {
    // Use the apiGet function which constructs the full URL from VITE_BACKEND_URL
    apiGet("/get-user")
      .then((data) => {
        if (data.email) {
          setUserEmail(data.email);
          setNewEmail(data.email);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleBioSave = () => {
    setBio(newBio);
    setEditingBio(false);
  };

  const handleEmailUpdate = async () => {
    try {
      const response = await fetch("/api/update-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail }),
      });
      const data = await response.json();
      if (response.ok) {
        setUserEmail(newEmail);
        setEditingEmail(false);
      } else {
        alert(data.error || "Email update failed");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while updating email.");
    }
  };

  useEffect(() => {
    // Animate the profile card on mount
    anime({
      targets: ".profile-card",
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 1000,
      easing: "easeOutExpo",
    });
  }, []);

  return (
    <main className="relative min-h-screen pt-20 flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black text-white bg-stars">
      {/* Background Animation, Overlay, and Floating Shapes */}
      <div className="background-animation absolute inset-0 opacity-40"></div>
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/50 to-black opacity-80"></div>
      <div className="floating-shapes absolute inset-0"></div>

      {/* Profile Card Container */}
      <div className="relative z-10 w-full max-w-3xl mx-auto px-4">
        {/* Profile Card with thin scrollbar for overflow and light glow */}
        <div className="profile-card bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl ring-2 ring-blue-400/50 p-6 overflow-auto scrollbar-thin max-h-[80vh]">
          <div className="flex flex-col items-center space-y-3">
            {/* Profile Picture */}
            <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center border-4 border-blue-500 shadow-lg">
              <span className="text-4xl text-blue-300">
                {username?.charAt(0).toUpperCase()}
              </span>
            </div>

            {/* Name Section */}
            <div className="text-center">
              <h2 className="text-lg uppercase text-gray-400 tracking-widest">
                Name
              </h2>
              <p className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
                {username}
              </p>
            </div>

            {/* Email Section */}
            <div className="w-full text-center">
              <h3 className="text-lg uppercase text-gray-400 tracking-widest">
                Email
              </h3>
              {editingEmail ? (
                <div className="flex items-center justify-center gap-2">
                  <input
                    type="email"
                    className="p-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500 transition"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                  <button
                    onClick={handleEmailUpdate}
                    className="px-3 py-1 bg-blue-500 rounded hover:bg-blue-600 transition text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingEmail(false);
                      setNewEmail(userEmail);
                    }}
                    className="px-3 py-1 bg-gray-600 rounded hover:bg-gray-500 transition text-sm"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span className="text-gray-300 text-base">
                    {userEmail || "Not set"}
                  </span>
                  <button
                    onClick={() => setEditingEmail(true)}
                    className="px-2 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition text-xs"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>

            {/* Bio Section */}
            <div className="w-full">
              <h3 className="text-lg uppercase text-gray-400 tracking-widest text-center">
                Bio
              </h3>
              {editingBio ? (
                <div>
                  <textarea
                    className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500 transition"
                    value={newBio}
                    onChange={(e) => setNewBio(e.target.value)}
                    rows={4}
                  />
                  <div className="flex justify-center gap-2 mt-3">
                    <button
                      onClick={handleBioSave}
                      className="px-4 py-1 bg-blue-500 rounded hover:bg-blue-600 transition text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingBio(false);
                        setNewBio(bio);
                      }}
                      className="px-4 py-1 bg-gray-600 rounded hover:bg-gray-500 transition text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-300 text-base leading-relaxed">
                    {bio}
                  </p>
                  <button
                    onClick={() => setEditingBio(true)}
                    className="mt-3 px-4 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition text-sm"
                  >
                    Edit Bio
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Profile;
