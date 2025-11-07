const express = require("express");
const {
  getAdminDashboard,
  getAllUsers,
  getUserById,
  deleteUser,
  getAuditLogs,
  getStats
} = require("../controllers/adminController.js");

const { protect } = require("../middleware/authMiddleware.js");
const { requireRole } = require("../middleware/rbac.js");

const router = express.Router();

// All routes below require admin role
router.use(protect, requireRole("admin"));

// Basic dashboard route
router.get("/dashboard", getAdminDashboard);

// Advanced management routes
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.delete("/users/:id", deleteUser);
router.get("/audit-logs", getAuditLogs);
router.get("/stats", getStats);

module.exports = router;
