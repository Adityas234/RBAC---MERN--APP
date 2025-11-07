import { useState } from "react";
import { API } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

export default function ProfileSettings() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      alert("✅ Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update password");
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex justify-center items-start pt-20 px-4">
      <div className="bg-[#111] p-8 rounded-lg w-full max-w-lg border border-gray-800">

        {/* Header */}
        <h2 className="text-3xl font-semibold mb-6 text-center">
          Profile Settings
        </h2>

        {/* User Info Display */}
        <div className="space-y-4 mb-8">
          <div>
            <label className="text-gray-400 text-sm">Name</label>
            <div className="bg-[#222] p-3 rounded border border-gray-700">
              {user?.name}
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-sm">Email</label>
            <div className="bg-[#222] p-3 rounded border border-gray-700">
              {user?.email}
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-sm">Role</label>
            <span
              className={`px-3 py-1 ml-2 text-xs rounded font-semibold ${
                user?.role === "admin" ? "bg-red-600" : "bg-green-600"
              }`}
            >
              {user?.role?.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-gray-800 mb-8" />

        {/* Password Update Form */}
        <form onSubmit={handlePasswordChange} className="space-y-4">

          <div>
            <label className="text-gray-400">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-[#222] p-3 rounded border border-gray-700 mt-1"
              required
            />
          </div>

          <div>
            <label className="text-gray-400">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-[#222] p-3 rounded border border-gray-700 mt-1"
              required
            />
          </div>

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded font-semibold transition"
          >
            Update Password
          </button>

        </form>
      </div>
    </div>
  );
}
