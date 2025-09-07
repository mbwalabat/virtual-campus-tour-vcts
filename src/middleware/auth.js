const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');
const { formatErrorResponse } = require('../utils/helpers');

// Verify JWT token
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json(
        formatErrorResponse('Access denied. No token provided.', 401)
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);
    
    if (!user || !user.isActive) {
      return res.status(401).json(
        formatErrorResponse('Invalid token or user not found.', 401)
      );
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json(
      formatErrorResponse('Invalid token.', 401)
    );
  }
};

// Check if user has required role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(
        formatErrorResponse('Authentication required.', 401)
      );
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json(
        formatErrorResponse('Access denied. Insufficient permissions.', 403)
      );
    }

    next();
  };
};

// Check if user is admin (departmentAdmin or superAdmin)
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json(
      formatErrorResponse('Authentication required.', 401)
    );
  }

  if (!['departmentAdmin', 'superAdmin'].includes(req.user.role)) {
    return res.status(403).json(
      formatErrorResponse('Admin access required.', 403)
    );
  }

  next();
};

// Check if user is super admin
const isSuperAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json(
      formatErrorResponse('Authentication required.', 401)
    );
  }

  if (req.user.role !== 'superAdmin') {
    return res.status(403).json(
      formatErrorResponse('Super admin access required.', 403)
    );
  }

  next();
};

module.exports = {
  authenticate,
  authorize,
  isAdmin,
  isSuperAdmin
};

