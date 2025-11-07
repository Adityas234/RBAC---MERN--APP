const User = require("../models/User.js");
const AuditLog = require("../models/AuditLog.js");

// Simple dashboard function
const getAdminDashboard = async (req, res) => {
  try {
    res.json({ message: "Welcome to Admin Dashboard", admin: req.user.name });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ error: "Failed to load admin dashboard" });
  }
};

// Advanced: Get all users
const getAllUsers = async (req, res) => {
  try {
    const { role, isActive, page = 1, limit = 20, search } = req.query;

    let query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === "true";
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find(query)
        .select("-password -refreshTokens")
        .sort("-createdAt")
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments(query)
    ]);

    res.json({
      users,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: "Failed to retrieve users" });
  }
};

// Get one user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve user" });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};

// Get audit logs
const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate("user", "name email role")
      .sort("-createdAt")
      .limit(50);
    res.json({ logs });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve audit logs" });
  }
};

// Get statistics
const getStats = async (req, res) => {
  try {
    const [totalUsers, activeUsers, usersByRole] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }])
    ]);

    res.json({
      users: {
        total: totalUsers,
        active: activeUsers,
        inactive: totalUsers - activeUsers,
        byRole: usersByRole
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve statistics" });
  }
};

module.exports = {
  getAdminDashboard,
  getAllUsers,
  getUserById,
  deleteUser,
  getAuditLogs,
  getStats
};
