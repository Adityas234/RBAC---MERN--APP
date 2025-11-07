import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function UserDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white p-10">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold">Hello, {user?.name} 👋</h1>
          <p className="text-gray-400 text-sm">Role: {user?.role}</p>
        </div>

        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <Link
          to="/content/create"
          className="bg-[#111] p-6 rounded-lg border border-gray-800 hover:bg-[#181818] transition"
        >
          <h3 className="text-xl font-semibold mb-2">✍️ Create Content</h3>
          <p className="text-gray-400 text-sm">Write something new!</p>
        </Link>

        <Link
          to="/content"
          className="bg-[#111] p-6 rounded-lg border border-gray-800 hover:bg-[#181818] transition"
        >
          <h3 className="text-xl font-semibold mb-2">📄 Your Content</h3>
          <p className="text-gray-400 text-sm">View and manage your posts.</p>
        </Link>

        <Link
          to="/profile"
          className="bg-[#111] p-6 rounded-lg border border-gray-800 hover:bg-[#181818] transition"
        >
          <h3 className="text-xl font-semibold mb-2">⚙️ Profile Settings</h3>
          <p className="text-gray-400 text-sm">Update password & account info.</p>
        </Link>

      </div>
    </div>
  );
}
