const express = require("express");
const router = express.Router();
const AuditLog = require("../models/AuditLog");
const { protect } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/rbac");

// Only admins can view logs
router.get("/", protect, requireRole("admin"), async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate("user", "name email role")
      .populate("target", "name email role")
      .sort({ createdAt: -1 });

    res.json({ logs });
  } catch (err) {
    res.status(500).json({ message: "Error fetching logs" });
  }
});

module.exports = router;
