const express = require('express');
const router = express.Router();
const {
  getAllLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
  uploadLocationFiles,
  getLocationsByDepartment,
  getLocationStats
} = require('../controllers/locationController');
const { authenticate, isAdmin } = require('../middleware/auth');
const {
  validateLocationCreate,
  validateLocationUpdate,
  validateObjectId,
  validatePagination
} = require('../middleware/validation');
const { uploadMixed, handleUploadError } = require('../middleware/upload');

// Public routes
router.get('/', validatePagination, getAllLocations);
router.get('/stats', getLocationStats);
router.get('/department/:department', getLocationsByDepartment);
router.get('/:id', validateObjectId('id'), getLocationById);

// Protected routes (Admin only)
router.use(authenticate);
router.use(isAdmin);

// Create new location
router.post('/', validateLocationCreate, createLocation);

// Update location
router.put('/:id', validateObjectId('id'), validateLocationUpdate, updateLocation);

// Upload files for location
router.post('/:id/upload', 
  validateObjectId('id'),
  uploadMixed,
  handleUploadError,
  uploadLocationFiles
);

// Delete location
router.delete('/:id', validateObjectId('id'), deleteLocation);

module.exports = router;

