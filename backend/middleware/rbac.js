// backend/middleware/rbac.js

const { hasPermission, hasAnyPermission, hasAllPermissions } = require('../config/roles');
const AuditLog = require('../models/AuditLog');

// Check if user has a specific role
const requireRole = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          error: 'Authentication required',
          code: 'NO_AUTH' 
        });
      }

      if (!allowedRoles.includes(req.user.role)) {
        await AuditLog.log({
          user: req.user._id,
          action: 'PERMISSION_DENIED',
          resource: req.baseUrl + req.path,
          status: 'failure',
          details: { 
            requiredRoles: allowedRoles,
            userRole: req.user.role,
            method: req.method
          },
          ipAddress: req.ip,
          userAgent: req.headers['user-agent']
        });

        return res.status(403).json({ 
          error: 'Insufficient permissions',
          code: 'FORBIDDEN',
          required: allowedRoles
        });
      }

      next();
    } catch (error) {
      console.error('Role check error:', error);
      res.status(500).json({ error: 'Authorization failed' });
    }
  };
};

// Check if user has a specific permission
const requirePermission = (...permissions) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          error: 'Authentication required',
          code: 'NO_AUTH' 
        });
      }

      const hasRequiredPermission = permissions.some(permission => 
        hasPermission(req.user.role, permission)
      );

      if (!hasRequiredPermission) {
        await AuditLog.log({
          user: req.user._id,
          action: 'PERMISSION_DENIED',
          resource: req.baseUrl + req.path,
          status: 'failure',
          details: { 
            requiredPermissions: permissions,
            userRole: req.user.role,
            method: req.method
          },
          ipAddress: req.ip,
          userAgent: req.headers['user-agent']
        });

        return res.status(403).json({ 
          error: 'Insufficient permissions',
          code: 'FORBIDDEN',
          required: permissions
        });
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({ error: 'Authorization failed' });
    }
  };
};

// Check if user has ALL specified permissions
const requireAllPermissions = (...permissions) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          error: 'Authentication required',
          code: 'NO_AUTH' 
        });
      }

      if (!hasAllPermissions(req.user.role, permissions)) {
        await AuditLog.log({
          user: req.user._id,
          action: 'PERMISSION_DENIED',
          resource: req.baseUrl + req.path,
          status: 'failure',
          details: { 
            requiredPermissions: permissions,
            userRole: req.user.role,
            method: req.method
          },
          ipAddress: req.ip,
          userAgent: req.headers['user-agent']
        });

        return res.status(403).json({ 
          error: 'Insufficient permissions',
          code: 'FORBIDDEN',
          required: permissions
        });
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({ error: 'Authorization failed' });
    }
  };
};

// Dynamic permission check based on request
const can = (permissionFn) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          error: 'Authentication required',
          code: 'NO_AUTH' 
        });
      }

      const allowed = await permissionFn(req);

      if (!allowed) {
        await AuditLog.log({
          user: req.user._id,
          action: 'PERMISSION_DENIED',
          resource: req.baseUrl + req.path,
          status: 'failure',
          details: { 
            userRole: req.user.role,
            method: req.method
          },
          ipAddress: req.ip,
          userAgent: req.headers['user-agent']
        });

        return res.status(403).json({ 
          error: 'Insufficient permissions',
          code: 'FORBIDDEN'
        });
      }

      next();
    } catch (error) {
      console.error('Dynamic permission check error:', error);
      res.status(500).json({ error: 'Authorization failed' });
    }
  };
};


const safeLog = async (entry) => {
  try {
    if (AuditLog && typeof AuditLog.log === "function") {
      await AuditLog.log(entry);
    } else {
      console.warn("⚠️ AuditLog.log is not defined");
    }
  } catch (err) {
    console.error("Failed to log audit:", err);
  }
};


module.exports = {
  requireRole,
  requirePermission,
  requireAllPermissions,
  can
};