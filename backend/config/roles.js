// backend/config/roles.js

const ROLES = {
  ADMIN: "admin",
  USER: "user",
  VIEWER: "viewer"
};

const PERMISSIONS = {
  // Content permissions
  CREATE_CONTENT: 'content:create',
  READ_CONTENT: 'content:read',
  UPDATE_CONTENT: 'content:update',
  DELETE_CONTENT: 'content:delete',
  
  // User management permissions
  CREATE_USER: 'user:create',
  READ_USER: 'user:read',
  UPDATE_USER: 'user:update',
  DELETE_USER: 'user:delete',
  ASSIGN_ROLE: 'user:assign_role',
  
  // Admin permissions
  VIEW_AUDIT_LOGS: 'admin:audit_logs',
  MANAGE_SYSTEM: 'admin:manage_system'
};

const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    PERMISSIONS.CREATE_CONTENT,
    PERMISSIONS.READ_CONTENT,
    PERMISSIONS.UPDATE_CONTENT,
    PERMISSIONS.DELETE_CONTENT,
    PERMISSIONS.CREATE_USER,
    PERMISSIONS.READ_USER,
    PERMISSIONS.UPDATE_USER,
    PERMISSIONS.DELETE_USER,
    PERMISSIONS.ASSIGN_ROLE,
    PERMISSIONS.VIEW_AUDIT_LOGS,
    PERMISSIONS.MANAGE_SYSTEM
  ],
  [ROLES.EDITOR]: [
    PERMISSIONS.CREATE_CONTENT,
    PERMISSIONS.READ_CONTENT,
    PERMISSIONS.UPDATE_CONTENT,
    PERMISSIONS.DELETE_CONTENT, // Only their own
    PERMISSIONS.READ_USER
  ],
  [ROLES.VIEWER]: [
    PERMISSIONS.READ_CONTENT,
    PERMISSIONS.READ_USER
  ]
};

const hasPermission = (role, permission) => {
  return ROLE_PERMISSIONS[role]?.includes(permission) || false;
};

const hasAnyPermission = (role, permissions) => {
  return permissions.some(permission => hasPermission(role, permission));
};

const hasAllPermissions = (role, permissions) => {
  return permissions.every(permission => hasPermission(role, permission));
};

module.exports = {
  ROLES,
  PERMISSIONS,
  ROLE_PERMISSIONS,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions
};