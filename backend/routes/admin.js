// backend/routes/admin.js

const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const { protect: authenticate } = require('../middleware/authMiddleware');
const { requireRole, requirePermission } = require('../middleware/rbac');
const { ROLES, PERMISSIONS } = require('../config/roles');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(requireRole(ROLES.ADMIN));

// Get all users
router.get('/users', async (req, res) => {
  try {
    const { role, isActive, page = 1, limit = 20, search } = req.query;

    let query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password -refreshTokens')
        .populate('createdBy', 'name email')
        .sort('-createdAt')
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
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
});

// Get user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -refreshTokens')
      .populate('createdBy', 'name email');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to retrieve user' });
  }
});

// Create user (admin can create with any role)
router.post('/users',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('name').trim().notEmpty(),
    body('role').isIn(Object.values(ROLES))
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, name, role } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const user = new User({
        email,
        password,
        name,
        role,
        createdBy: req.user._id
      });

      await user.save();

      await AuditLog.log({
        user: req.user._id,
        action: 'USER_CREATED',
        resource: 'User',
        resourceId: user._id,
        details: { email, name, role, createdBy: req.user.email },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      });

      res.status(201).json({ 
        message: 'User created successfully',
        user: user.toJSON()
      });
    } catch (error) {
      console.error('Create user error:', error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  }
);

// Update user
router.put('/users/:id',
  [
    body('email').optional().isEmail().normalizeEmail(),
    body('name').optional().trim().notEmpty(),
    body('role').optional().isIn(Object.values(ROLES)),
    body('isActive').optional().isBoolean()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Prevent admin from deactivating themselves
      if (req.params.id === req.user._id.toString() && req.body.isActive === false) {
        return res.status(400).json({ error: 'Cannot deactivate your own account' });
      }

      const { email, name, role, isActive } = req.body;
      const oldRole = user.role;

      if (email) user.email = email;
      if (name) user.name = name;
      if (role) user.role = role;
      if (isActive !== undefined) user.isActive = isActive;

      await user.save();

      await AuditLog.log({
        user: req.user._id,
        action: 'USER_UPDATED',
        resource: 'User',
        resourceId: user._id,
        details: { 
          changes: req.body,
          oldRole,
          newRole: user.role,
          updatedBy: req.user.email 
        },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      });

      res.json({ 
        message: 'User updated successfully',
        user: user.toJSON()
      });
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({ error: 'Failed to update user' });
    }
  }
);

// Assign role to user
router.patch('/users/:id/role',
  body('role').isIn(Object.values(ROLES)),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const oldRole = user.role;
      user.role = req.body.role;

      await user.save();

      await AuditLog.log({
        user: req.user._id,
        action: 'ROLE_ASSIGNED',
        resource: 'User',
        resourceId: user._id,
        details: { 
          oldRole,
          newRole: user.role,
          assignedBy: req.user.email 
        },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      });

      res.json({ 
        message: 'Role assigned successfully',
        user: user.toJSON()
      });
    } catch (error) {
      console.error('Assign role error:', error);
      res.status(500).json({ error: 'Failed to assign role' });
    }
  }
);

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent admin from deleting themselves
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    await user.deleteOne();

    await AuditLog.log({
      user: req.user._id,
      action: 'USER_DELETED',
      resource: 'User',
      resourceId: user._id,
      details: { 
        email: user.email,
        role: user.role,
        deletedBy: req.user.email 
      },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Get audit logs
router.get('/audit-logs', async (req, res) => {
  try {
    const { 
      userId, 
      action, 
      resource, 
      status,
      startDate, 
      endDate,
      page = 1, 
      limit = 50 
    } = req.query;

    let query = {};
    if (userId) query.user = userId;
    if (action) query.action = action;
    if (resource) query.resource = resource;
    if (status) query.status = status;
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      AuditLog.find(query)
        .populate('user', 'name email role')
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit)),
      AuditLog.countDocuments(query)
    ]);

    res.json({
      logs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({ error: 'Failed to retrieve audit logs' });
  }
});

// Get system statistics
router.get('/stats', async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      usersByRole,
      recentLogins,
      recentActions
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } }
      ]),
      User.find({ lastLogin: { $ne: null } })
        .sort('-lastLogin')
        .limit(10)
        .select('name email lastLogin'),
      AuditLog.aggregate([
        { $group: { _id: '$action', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ])
    ]);

    res.json({
      users: {
        total: totalUsers,
        active: activeUsers,
        inactive: totalUsers - activeUsers,
        byRole: usersByRole
      },
      recentLogins,
      recentActions
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to retrieve statistics' });
  }
});

module.exports = router;