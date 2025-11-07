import { useEffect, useState } from "react";
import { API } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

export default function AdminUsers() {
  const { logout } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await API.get("/users");
    setUsers(res.data.users.filter(u => u.role === "user" || u.role === "viewer"));
  };

  const updateRole = async (id, role) => {
    try {
      await API.patch(`/users/${id}/role`, { role });
      fetchUsers();
    } catch (err) {
      alert("Error updating role");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await API.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert("Error deleting user");
    }
  };

  return (
    <div className="text-white">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold">Users</h1>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
        >
          Logout
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#111] rounded-lg overflow-hidden border border-gray-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#161616] border-b border-gray-800">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b border-gray-800 hover:bg-[#181818]">
                <td className="p-4">{u.name}</td>
                <td className="p-4">{u.email}</td>

                {/* Role Update Dropdown */}
                <td className="p-4">
                  <select
                    value={u.role}
                    onChange={(e) => updateRole(u._id, e.target.value)}
                    className="bg-[#222] border border-gray-700 px-2 py-1 rounded text-xs"
                  >
                    <option value="user">USER</option>
                    <option value="viewer">VIEWER</option>
                    <option value="admin">ADMIN</option>
                  </select>
                </td>

                {/* Delete Button */}
                <td className="p-4 text-right">
                  <button
                    onClick={() => deleteUser(u._id)}
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

    </div>
  );
}
