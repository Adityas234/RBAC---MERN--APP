const AuditLog = require("../models/AuditLog");

module.exports = async function logAction(userId, action, targetId = null) {
  try {
    await AuditLog.create({
      user: userId,
      action,
      target: targetId
    });
  } catch (err) {
    console.error("Audit Log Error:", err);
  }
};
