// backend/utils/AuditLog.js

/**
 * Simple utility to log user actions for debugging or audit purposes.
 * In production, you could save this to a database or a file.
 */

module.exports.log = async function (userId, action, extra = {}) {
  const timestamp = new Date().toISOString();
  console.log(`[Audit Log] User: ${userId} | Action: ${action} | Time: ${timestamp}`);

  // Optional: if you later want to save this to MongoDB, you can add code here.
  // Example:
  // const Audit = require('../models/AuditLog');
  // await Audit.create({ userId, action, timestamp });
};
