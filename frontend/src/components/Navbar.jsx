import { Link } from "react-router-dom";

export default function Navbar() {
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (!token) return null; // ✅ Hide Navbar on login & register

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <Link to="/dashboard" className="text-xl font-bold">MyApp</Link>

      <div className="space-x-4">
        <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
        <button onClick={logout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">
          Logout
        </button>
      </div>
    </nav>
  );
}
