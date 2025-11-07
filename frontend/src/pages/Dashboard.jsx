// frontend/src/pages/Dashboard.jsx
import { useAuth } from "../context/AuthContext";
import AdminDashboard from "./admin/AdminDashboard";
import UserDashboard from "./users/userDashboard";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading...
      </div>
    );
  }

  // ✅ Show Admin or User dashboard based on role
  return user.role === "admin" ? <AdminDashboard /> : <UserDashboard />;
}
