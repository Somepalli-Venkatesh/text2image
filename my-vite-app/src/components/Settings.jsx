// components/Settings.jsx
import React, { useState, useEffect } from "react";
import anime from "animejs";

function Settings() {
  // Account Settings State
  const [userEmail, setUserEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [editingEmail, setEditingEmail] = useState(false);

  // Password Reset State
  const [emailForReset, setEmailForReset] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  // Display Settings State
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  // Notification Settings State (persisted in localStorage)
  const [emailNotifications, setEmailNotifications] = useState(
    localStorage.getItem("emailNotifications") === "true"
  );
  const [pushNotifications, setPushNotifications] = useState(
    localStorage.getItem("pushNotifications") === "true"
  );

  // Privacy Settings State (persisted in localStorage)
  const [profilePrivate, setProfilePrivate] = useState(
    localStorage.getItem("profilePrivate") === "true"
  );
  const [showActivityStatus, setShowActivityStatus] = useState(
    localStorage.getItem("showActivityStatus") === "true"
  );

  // Advanced Security: Delete Account Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch user info via /api/get-user and prefill reset email
  useEffect(() => {
    fetch("/api/get-user")
      .then((res) => res.json())
      .then((data) => {
        if (data.email) {
          setUserEmail(data.email);
          setNewEmail(data.email);
          setEmailForReset(data.email);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // Animate the settings card on mount
  useEffect(() => {
    anime({
      targets: ".settings-card",
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 1000,
      easing: "easeOutExpo",
    });
  }, []);

  // Account: Email update handler
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

  // Account: Send OTP for password reset
  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailForReset }),
      });
      const data = await response.json();
      if (response.ok) {
        setOtpSent(true);
        setPasswordMessage(data.message || "OTP sent to your email.");
      } else {
        setPasswordMessage(data.error || "Failed to send OTP.");
      }
    } catch (error) {
      console.error(error);
      setPasswordMessage("An error occurred.");
    }
  };

  // Account: Reset password using OTP
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailForReset,
          otp,
          new_password: newPassword,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setPasswordMessage(data.message || "Password reset successfully!");
        // Reset fields and exit OTP mode
        setOtp("");
        setNewPassword("");
        setOtpSent(false);
      } else {
        setPasswordMessage(data.error || "Failed to reset password.");
      }
    } catch (error) {
      console.error(error);
      setPasswordMessage("An error occurred.");
    }
  };

  // Cancel password reset process
  const cancelReset = () => {
    setOtpSent(false);
    setOtp("");
    setNewPassword("");
    setPasswordMessage("");
  };

  // Display: Theme toggle handler with conditional styling update
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("light", newTheme === "light");
  };

  // Notification: Toggle email notifications and save preference
  const toggleEmailNotifications = () => {
    const newValue = !emailNotifications;
    setEmailNotifications(newValue);
    localStorage.setItem("emailNotifications", newValue);
  };

  // Notification: Toggle push notifications and save preference
  const togglePushNotifications = () => {
    const newValue = !pushNotifications;
    setPushNotifications(newValue);
    localStorage.setItem("pushNotifications", newValue);
  };

  // Privacy: Toggle profile privacy and save preference
  const toggleProfilePrivacy = () => {
    const newValue = !profilePrivate;
    setProfilePrivate(newValue);
    localStorage.setItem("profilePrivate", newValue);
  };

  // Privacy: Toggle activity status display and save preference
  const toggleActivityStatus = () => {
    const newValue = !showActivityStatus;
    setShowActivityStatus(newValue);
    localStorage.setItem("showActivityStatus", newValue);
  };

  // Advanced Security: Delete Account: Show modal
  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteAccount = () => {
    // Replace this alert with your backend deletion logic
    alert("Account deletion feature is under development.");
    setShowDeleteModal(false);
  };

  return (
    <main
      className={`relative min-h-screen pt-28 pb-8 px-4 overflow-hidden bg-stars ${
        theme === "dark"
          ? "bg-gradient-to-br from-black via-gray-900 to-black text-white"
          : "bg-gradient-to-br from-white via-gray-200 to-white text-black"
      }`}
    >
      {/* Background Animation, Overlay, and Floating Shapes */}
      <div className="background-animation absolute inset-0 opacity-40"></div>
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/50 to-black opacity-80"></div>
      <div className="floating-shapes absolute inset-0"></div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center mb-4">Settings</h1>

        {/* Settings Card */}
        <div className="settings-card bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-6 overflow-auto scrollbar-thin max-h-[70vh] space-y-6">
          {/* Account Settings Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white border-b border-gray-700 pb-2">
              ACCOUNT SETTINGS
            </h2>
            {/* Update Email */}
            <div>
              <label className="block text-gray-300 uppercase text-sm mb-1">
                Email
              </label>
              {editingEmail ? (
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500 transition"
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
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">
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

            {/* Password Reset */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-2 uppercase">
                Reset Password
              </h3>
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-3">
                  <div>
                    <label
                      className="block text-gray-300 text-sm mb-1"
                      htmlFor="resetEmail"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="resetEmail"
                      className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500 transition"
                      value={emailForReset}
                      onChange={(e) => setEmailForReset(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-blue-500 rounded text-white hover:bg-blue-600 transition"
                  >
                    Send OTP
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-3">
                  <div>
                    <label
                      className="block text-gray-300 text-sm mb-1"
                      htmlFor="otp"
                    >
                      OTP
                    </label>
                    <input
                      type="text"
                      id="otp"
                      className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500 transition"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="block text-gray-300 text-sm mb-1"
                      htmlFor="newPassword"
                    >
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500 transition"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex justify-between gap-2">
                    <button
                      type="submit"
                      className="w-full px-4 py-2 bg-blue-500 rounded text-white hover:bg-blue-600 transition"
                    >
                      Reset Password
                    </button>
                    <button
                      type="button"
                      onClick={cancelReset}
                      className="w-full px-4 py-2 bg-gray-600 rounded text-white hover:bg-gray-500 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
              {passwordMessage && (
                <p className="mt-2 text-center text-gray-300 text-sm">
                  {passwordMessage}
                </p>
              )}
            </div>
          </section>

          {/* Display Settings Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white border-b border-gray-700 pb-2">
              DISPLAY SETTINGS
            </h2>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Theme Mode:</span>
              {/* Custom Toggle Button */}
              <div
                onClick={toggleTheme}
                className="relative w-12 h-6 bg-gray-600 rounded-full cursor-pointer transition-colors duration-300"
              >
                <div
                  className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300"
                  style={{
                    transform:
                      theme === "dark" ? "translateX(0)" : "translateX(24px)",
                  }}
                ></div>
              </div>
            </div>
          </section>

          {/* Notification Settings Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white border-b border-gray-700 pb-2">
              NOTIFICATION SETTINGS
            </h2>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Email Notifications</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={toggleEmailNotifications}
                />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Push Notifications</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={pushNotifications}
                  onChange={togglePushNotifications}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </section>

          {/* Privacy Settings Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white border-b border-gray-700 pb-2">
              PRIVACY SETTINGS
            </h2>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Profile Private</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={profilePrivate}
                  onChange={toggleProfilePrivacy}
                />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Show Activity Status</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={showActivityStatus}
                  onChange={toggleActivityStatus}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </section>

          {/* Advanced Security Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white border-b border-gray-700 pb-2">
              DELETE SETTINGS
            </h2>
            <div className="flex flex-col space-y-3">
              <button
                onClick={handleDeleteAccount}
                className="w-full px-4 py-2 bg-red-600 rounded text-white hover:bg-red-700 transition"
              >
                Delete Account
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-gray-800 p-6 rounded-lg z-10 max-w-sm mx-auto">
            <h3 className="text-xl font-semibold text-white mb-4">
              Confirm Account Deletion
            </h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 transition text-white"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAccount}
                className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Settings;
