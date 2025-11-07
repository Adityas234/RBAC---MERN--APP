// backend/utils/auditLogger.js

const AuditLog = require('../models/AuditLog');

/**
 * Logs user actions to the AuditLog collection.
 * 
 * @param {Object} data - Audit log data
 * @param {string} data.user - User ID (can be null)
 * @param {string} data.action - Action type (e.g. USER_LOGIN)
 * @param {string} data.resource - Related resource name (e.g. Auth, User)
 * @param {string} [data.resourceId] - Optional related resource ID
 * @param {Object} [data.details] - Extra metadata
 * @param {string} [data.status] - success | failure
 * @param {string} [data.ipAddress] - Client IP
 * @param {string} [data.userAgent] - Browser info
 */
async function logAudit(data) {
  try {
    const logEntry = new AuditLog({
      user: data.user || null,
      action: data.action,
      resource: data.resource,
      resourceId: data.resourceId || null,
      details: data.details || {},
      status: data.status || 'success',
      ipAddress: data.ipAddress || 'N/A',
      userAgent: data.userAgent || 'N/A'
    });

    await logEntry.save();
  } catch (error) {
    console.error('Audit log failed:', error);
  }
}

module.exports = { logAudit };
