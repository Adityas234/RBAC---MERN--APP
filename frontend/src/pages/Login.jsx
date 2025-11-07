import { useState } from "react";
import { API } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await API.post("/auth/login", form);

    login({
      user: res.data.user,
      token: res.data.token
    });

    const role = res.data.user.role;

    if (role === "admin") {
      window.location.href = "/admin/dashboard";
    } 
    else if (role === "viewer") {
      window.location.href = "/viewer/dashboard";
    }
    else {
      window.location.href = "/user/dashboard";
    }

  } catch (error) {
    console.error("Login error:", error);
    alert("Login failed. Check credentials.");
  }
};



  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#111] border border-gray-800 p-8 rounded-2xl shadow-xl">

        {/* Heading */}
        <h2 className="text-3xl font-bold text-white text-center mb-2">
          Welcome Back 👋
        </h2>
        <p className="text-center text-gray-400 text-sm mb-6">
          Login to access your dashboard
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="text-gray-300 text-sm">Email</label>
            <input
              type="email"
              className="mt-1 w-full p-3 rounded-lg bg-[#181818] text-white placeholder-gray-400 
                         border border-gray-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-800
                         outline-none transition"
              placeholder="you@example.com"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm">Password</label>
            <input
              type="password"
              className="mt-1 w-full p-3 rounded-lg bg-[#181818] text-white placeholder-gray-400 
                         border border-gray-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-800
                         outline-none transition"
              placeholder="••••••••"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-medium transition 
              ${loading ? "bg-blue-800 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-gray-400 text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}
