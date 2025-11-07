import { useEffect, useState } from "react";
import { API } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ total: 0, admins: 0, roles: 0 });
  const [search, setSearch] = useState("");

  // ✅ Modal State
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "user" });

  useEffect(() => {
  if (user?.role === "admin") {
    fetchUsers();
  }
}, [user]);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data.users);

      const total = res.data.users.length;
      const admins = res.data.users.filter((u) => u.role === "admin").length;
      const roles = new Set(res.data.users.map((u) => u.role)).size;

      setStats({ total, admins, roles });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // ✅ Create New User
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", newUser);
      setShowModal(false);
      setNewUser({ name: "", email: "", password: "", role: "user" });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Error creating user");
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await API.patch(`/users/${id}/role`, { role: newRole });
      fetchUsers();
    } catch {
      alert("Error updating role");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await API.delete(`/users/${id}`);
      fetchUsers();
    } catch {
      alert("Error deleting user");
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white p-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-semibold">Admin Dashboard</h1>
          <p className="text-gray-400">Manage users, roles, and permissions</p>
        </div>

        <button onClick={logout} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm">
          Logout
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <StatCard label="Total Users" value={stats.total} />
        <StatCard label="Active Roles" value={stats.roles} />
        <StatCard label="Administrators" value={stats.admins} />
      </div>

      {/* Header + Search + Add Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">User Management</h2>

        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#111] border border-gray-700 px-3 py-2 rounded text-sm"
          />
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
          >
            + Add User
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#111] rounded-lg overflow-hidden border border-gray-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#161616] border-b border-gray-800">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Created</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u._id} className="border-b border-gray-800 hover:bg-[#181818]">
                <td className="p-4">{u.name}</td>
                <td className="p-4">{u.email}</td>

                <td className="p-4">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    className="bg-[#222] border border-gray-700 px-2 py-1 rounded text-xs"
                  >
                    <option value="user">USER</option>
                    <option value="admin">ADMIN</option>
                    <option value="viewer">VIEWER</option>
                  </select>
                </td>

                <td className="p-4">{new Date(u.createdAt).toLocaleDateString()}</td>

                <td className="p-4 text-right">
                  <button
                    onClick={() => handleDelete(u._id)}
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs"
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Create User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
          <form
            onSubmit={handleCreateUser}
            className="bg-[#111] p-6 rounded-lg w-96 border border-gray-700 space-y-4"
          >
            <h2 className="text-lg font-semibold">Create New User</h2>

            <input
              placeholder="Name"
              className="w-full bg-[#222] p-2 rounded"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full bg-[#222] p-2 rounded"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full bg-[#222] p-2 rounded"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            />

            <select
              className="w-full bg-[#222] p-2 rounded"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>   // ✅ ADD THIS 
            </select>

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} type="button" className="px-3 py-1 text-sm">
                Cancel
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded text-sm">
                Create
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

/* Stats UI */
function StatCard({ label, value }) {
  return (
    <div className="bg-[#111] p-6 rounded-lg text-center border border-gray-800">
      <h3 className="text-4xl font-bold mb-1">{value}</h3>
      <p className="text-gray-400">{label}</p>
    </div>
  );
}
