import { useState } from "react";
import { API } from "../utils/api";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", form);
      alert("✅ Registered Successfully!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Server error during registration");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0d0d0d] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-[#111] p-8 rounded-lg border border-gray-800 shadow-xl space-y-5"
      >
        <h2 className="text-2xl font-semibold text-center text-white">Create Account</h2>

        {/* Name */}
        <div>
          <label className="text-sm text-gray-300">Name</label>
          <input
            className="mt-1 w-full p-3 rounded-lg bg-[#181818] text-white placeholder-gray-400 
                       border border-gray-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-800
                       outline-none transition"
            placeholder="Your Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-sm text-gray-300">Email</label>
          <input
            type="email"
            className="mt-1 w-full p-3 rounded-lg bg-[#181818] text-white placeholder-gray-400 
                       border border-gray-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-800
                       outline-none transition"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="text-sm text-gray-300">Password</label>
          <input
            type="password"
            className="mt-1 w-full p-3 rounded-lg bg-[#181818] text-white placeholder-gray-400 
                       border border-gray-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-800
                       outline-none transition"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>

        {/* Role Selection */}
        <div>
          <label className="text-sm text-gray-300">Select Role</label>
          <select
            className="mt-1 w-full p-3 rounded-lg bg-[#181818] text-white border border-gray-700 
                       focus:border-blue-600 outline-none"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="viewer">Viewer</option> {/* ✅ Add this */}
          </select>
        </div>

        {/* Submit */}
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
        >
          Register
        </button>

        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:text-blue-300">Login</Link>
        </p>
      </form>
    </div>
  );
}
