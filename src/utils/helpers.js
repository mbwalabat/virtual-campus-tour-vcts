const path = require('path');
const fs = require('fs').promises;

// Generate unique filename
const generateUniqueFilename = (originalName) => {
  const timestamp = Date.now();
  const random = Math.round(Math.random() * 1E9);
  const extension = path.extname(originalName);
  const baseName = path.basename(originalName, extension);
  return `${baseName}_${timestamp}_${random}${extension}`;
};

// Delete file helper
const deleteFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

// Validate file type
const validateFileType = (file, allowedTypes) => {
  const fileExtension = path.extname(file.originalname).toLowerCase();
  return allowedTypes.includes(fileExtension);
};

// Format error response
const formatErrorResponse = (message, statusCode = 400, errors = null) => {
  return {
    success: false,
    message,
    statusCode,
    errors
  };
};

// Format success response
const formatSuccessResponse = (data, message = 'Success') => {
  return {
    success: true,
    message,
    data
  };
};

// Pagination helper
const getPaginationOptions = (page = 1, limit = 10) => {
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);
  const skip = (pageNumber - 1) * limitNumber;
  
  return {
    skip,
    limit: limitNumber,
    page: pageNumber
  };
};

module.exports = {
  generateUniqueFilename,
  deleteFile,
  validateFileType,
  formatErrorResponse,
  formatSuccessResponse,
  getPaginationOptions
};

