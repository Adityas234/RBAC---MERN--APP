const AuditLog = require("../models/AuditLog");

const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate("actor", "name email role")
      .populate("target", "name email role")
      .sort({ createdAt: -1 });

    res.json({ logs });
  } catch (err) {
    res.status(500).json({ message: "Error fetching audit logs" });
  }
};

module.exports = { getAuditLogs };
