const multer = require('multer');
const path = require('path');
const { generateUniqueFilename, validateFileType } = require('../utils/helpers');
const config = require('../config/config');

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath;
    
    switch (file.fieldname) {
      case 'images':
        uploadPath = path.join(config.uploadPath, 'images');
        break;
      case 'audio':
        uploadPath = path.join(config.uploadPath, 'audio');
        break;
      case 'video':
        uploadPath = path.join(config.uploadPath, 'video');
        break;
      case 'view360':
        uploadPath = path.join(config.uploadPath, '360views');
        break;
      default:
        uploadPath = config.uploadPath;
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = generateUniqueFilename(file.originalname);
    cb(null, uniqueName);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  let allowedTypes;
  
  switch (file.fieldname) {
    case 'images':
    case 'view360':
      allowedTypes = ['.jpg', '.jpeg', '.png', '.gif'];
      break;
    case 'audio':
      allowedTypes = ['.mp3', '.wav', '.ogg'];
      break;
    case 'video':
      allowedTypes = ['.mp4', '.webm', '.mov'];
      break;
    default:
      allowedTypes = ['.jpg', '.jpeg', '.png', '.gif', '.mp3', '.wav', '.ogg', '.mp4', '.webm', '.mov'];
  }
  
  if (validateFileType(file, allowedTypes)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`), false);
  }
};

// Multer configuration
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.maxFileSize,
    files: 10 // Maximum 10 files per request
  }
});

// Error handling middleware for multer
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 10MB.',
        statusCode: 400
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum 10 files allowed.',
        statusCode: 400
      });
    }
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      message: error.message,
      statusCode: 400
    });
  }
  
  next(error);
};

// Upload configurations for different file types
const uploadImages = upload.array('images', 5);
const uploadAudio = upload.single('audio');
const uploadView360 = upload.single('view360');
const uploadMixed = upload.fields([
  { name: 'images', maxCount: 5 },
  { name: 'audio', maxCount: 1 },
  { name: 'video', maxCount: 1 },
  { name: 'view360', maxCount: 1 }
]);

module.exports = {
  uploadImages,
  uploadAudio,
  uploadView360,
  uploadMixed,
  handleUploadError
};

