const express = require('express');
const router = express.Router();
const {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentStats,
  getDepartmentUsers,
  getDepartmentLocations
} = require('../controllers/departmentController');
const { authenticate, isAdmin, isSuperAdmin } = require('../middleware/auth');
const {
  validateDepartmentCreate,
  validateObjectId,
  validatePagination
} = require('../middleware/validation');

// Public routes
router.get('/', validatePagination, getAllDepartments);
router.get('/stats', getDepartmentStats);
router.get('/:id', validateObjectId('id'), getDepartmentById);

// Protected routes
router.use(authenticate);

// Get department users and locations (Admin only)
router.get('/:id/users', isAdmin, validateObjectId('id'), validatePagination, getDepartmentUsers);
router.get('/:id/locations', isAdmin, validateObjectId('id'), validatePagination, getDepartmentLocations);

// Super Admin only routes
router.use(isSuperAdmin);

// Create new department
router.post('/', validateDepartmentCreate, createDepartment);

// Update department
router.put('/:id', validateObjectId('id'), validateDepartmentCreate, updateDepartment);

// Delete department
router.delete('/:id', validateObjectId('id'), deleteDepartment);

module.exports = router;

