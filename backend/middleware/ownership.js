// backend/middleware/ownership.js

const { ROLES } = require('../config/roles');
const AuditLog = require('../models/AuditLog');

/**
 * Check if user owns the resource or has admin privileges
 * @param {String} modelName - Name of the model (e.g., 'Content')
 * @param {String} paramName - Request parameter containing resource ID (default: 'id')
 * @param {String} ownerField - Field name that contains owner ID (default: 'author')
 */
const requireOwnership = (modelName, paramName = 'id', ownerField = 'author') => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          error: 'Authentication required',
          code: 'NO_AUTH' 
        });
      }

      // Admins bypass ownership checks
      if (req.user.role === ROLES.ADMIN) {
        return next();
      }

      const resourceId = req.params[paramName];
      
      if (!resourceId) {
        return res.status(400).json({ 
          error: 'Resource ID required',
          code: 'MISSING_ID' 
        });
      }

      // Dynamically require the model
      const Model = require(`../models/${modelName}`);
      const resource = await Model.findById(resourceId);

      if (!resource) {
        return res.status(404).json({ 
          error: `${modelName} not found`,
          code: 'NOT_FOUND' 
        });
      }

      // Check ownership
      const ownerId = resource[ownerField];
      const isOwner = ownerId && ownerId.toString() === req.user._id.toString();

      if (!isOwner) {
        await AuditLog.log({
          user: req.user._id,
          action: 'PERMISSION_DENIED',
          resource: modelName,
          resourceId: resource._id,
          status: 'failure',
          details: { 
            reason: 'Not resource owner',
            userRole: req.user.role,
            method: req.method
          },
          ipAddress: req.ip,
          userAgent: req.headers['user-agent']
        });

        return res.status(403).json({ 
          error: 'You can only modify your own resources',
          code: 'NOT_OWNER' 
        });
      }

      // Attach resource to request for use in route handler
      req.resource = resource;
      next();
    } catch (error) {
      console.error('Ownership check error:', error);
      res.status(500).json({ error: 'Authorization failed' });
    }
  };
};

/**
 * Check ownership OR specific permission
 */
const requireOwnershipOrPermission = (modelName, permission, paramName = 'id', ownerField = 'author') => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          error: 'Authentication required',
          code: 'NO_AUTH' 
        });
      }

      const { hasPermission } = require('../config/roles');
      
      // Check if user has the permission (e.g., admin deleting any content)
      if (hasPermission(req.user.role, permission)) {
        return next();
      }

      // Otherwise, check ownership
      const resourceId = req.params[paramName];
      
      if (!resourceId) {
        return res.status(400).json({ 
          error: 'Resource ID required',
          code: 'MISSING_ID' 
        });
      }

      const Model = require(`../models/${modelName}`);
      const resource = await Model.findById(resourceId);

      if (!resource) {
        return res.status(404).json({ 
          error: `${modelName} not found`,
          code: 'NOT_FOUND' 
        });
      }

      const ownerId = resource[ownerField];
      const isOwner = ownerId && ownerId.toString() === req.user._id.toString();

      if (!isOwner) {
        await AuditLog.log({
          user: req.user._id,
          action: 'PERMISSION_DENIED',
          resource: modelName,
          resourceId: resource._id,
          status: 'failure',
          details: { 
            reason: 'Not owner and lacks permission',
            requiredPermission: permission,
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

      req.resource = resource;
      next();
    } catch (error) {
      console.error('Ownership/permission check error:', error);
      res.status(500).json({ error: 'Authorization failed' });
    }
  };
};

/**
 * Filter query to only show user's own resources (unless admin)
 */
const scopeToOwner = (ownerField = 'author') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        code: 'NO_AUTH' 
      });
    }

    // Admins see everything
    if (req.user.role !== ROLES.ADMIN) {
      // Add owner filter to query
      req.ownerFilter = { [ownerField]: req.user._id };
    }

    next();
  };
};

module.exports = {
  requireOwnership,
  requireOwnershipOrPermission,
  scopeToOwner
};