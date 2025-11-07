import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout() {
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-[#0d0d0d]">

      {/* Sidebar */}
      <aside className="w-64 bg-[#0b0f15] border-r border-gray-800 p-6">
        <h2 className="text-xl font-bold text-white mb-6">Admin Panel</h2>

        <nav className="space-y-3">
          <NavLink
            to="/admin/dashboard"
            className="block text-gray-300 hover:text-white"
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/users"
            className="block text-gray-300 hover:text-white"
          >
            Users
          </NavLink>

          <NavLink
            to="/admin/logs"
            className="block text-gray-300 hover:text-white"
          >
            Audit Logs
          </NavLink>
        </nav>

        <button
          onClick={logout}
          className="mt-8 w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm text-white"
        >
          Logout
        </button>
      </aside>

      {/* Page Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
