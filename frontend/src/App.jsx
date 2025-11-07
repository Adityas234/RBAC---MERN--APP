import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./guards/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard"; // old, still works
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminLogs from "./pages/admin/AdminAuditLogs";

import UserDashboard from "./pages/users/userDashboard";
import CreateContent from "./pages/content/CreateContent";
import UserContent from "./pages/content/UserContent";
import Profile from "./pages/users/Profile";

// ✅ NEW VIEWER DASHBOARD
import ViewerDashboard from "./pages/viewer/ViewerDashboard";

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* OLD Dashboard (still accessible) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* ✅ USER ROUTES */}
      <Route
        path="/user/dashboard"
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/content/create"
        element={
          <ProtectedRoute>
            <CreateContent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/content"
        element={
          <ProtectedRoute>
            <UserContent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* ✅ VIEWER ROUTES */}
      <Route
        path="/viewer/dashboard"
        element={
          <ProtectedRoute requireRole="viewer">
            <ViewerDashboard />
          </ProtectedRoute>
        }
      />

      {/* ✅ ADMIN ROUTES */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >

        

        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="logs" element={<AdminLogs />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default App;
