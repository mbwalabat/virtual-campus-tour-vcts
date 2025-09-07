const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserStats,
  makeInactive,
  makeActive
} = require('../controllers/userController.js');
const { authenticate, isAdmin, isSuperAdmin } = require('../middleware/auth');
const {
  validateUserRegistration,
  validateUserUpdate,
  validateObjectId,
  validatePagination
} = require('../middleware/validation');

// All routes require authentication
router.use(authenticate);

// Get user statistics (Admin only)
router.get('/stats', isAdmin, getUserStats);
// Get all users with pagination and filtering (Admin only)
router.get('/', isAdmin, validatePagination, getAllUsers);
// Make user inactive (Super Admin only)
router.put('/:id/inactive', isSuperAdmin, validateObjectId('id'), makeInactive);
// Make user active (Super Admin only)
router.put('/:id/active', isSuperAdmin, validateObjectId('id'), makeActive);
// Delete user (Super Admin only)
router.delete('/:id', isSuperAdmin, validateObjectId('id'), deleteUser);
// Get user by ID (Admin only)
router.get('/:id', isAdmin, validateObjectId('id'), getUserById);
// Create new user (Admin only)
router.post('/', isAdmin, validateUserRegistration, createUser);
// Update user (Admin only)
router.put('/:id', isAdmin, validateObjectId('id'), validateUserUpdate, updateUser);

module.exports = router;
