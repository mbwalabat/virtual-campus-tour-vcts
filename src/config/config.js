module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/campus_navigation',
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret_key',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760, // 10MB
  uploadPath: process.env.UPLOAD_PATH || './uploads',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
};

