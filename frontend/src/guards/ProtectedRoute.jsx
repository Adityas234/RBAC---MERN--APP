import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, requireRole }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-white p-10">Loading...</div>;

  // Not logged in → go to login
  if (!user) return <Navigate to="/login" replace />;

  // If a role is required → check it
  if (requireRole && user.role !== requireRole) {
    // Redirect by user role
    switch (user.role) {
      case "admin":
        return <Navigate to="/admin/dashboard" replace />;
      case "viewer":
        return <Navigate to="/viewer/dashboard" replace />;
      default:
        return <Navigate to="/user/dashboard" replace />;
    }
  }

  // ✅ No role conflict → allow access
  return children;
}
