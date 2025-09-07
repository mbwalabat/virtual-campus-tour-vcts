require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

const connectDB = require('./src/config/database');
const config = require('./src/config/config');

// Import routes
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/users');
const locationRoutes = require('./src/routes/locations');
const departmentRoutes = require('./src/routes/departments');
const uploadRoutes = require('./src/routes/uploads');

// Create Express app
const app = express();

// Connect to database
connectDB();

// Security middleware
// Security middleware with custom CSP
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      "default-src": ["'self'"],
      "img-src": ["'self'", "data:", "https:", "https://images.pexels.com", "https://res.cloudinary.com"],
      "media-src": ["'self'", "data:", "https:", "https://res.cloudinary.com"],
      "script-src": ["'self'", "'unsafe-inline'"],
      "style-src": ["'self'", "'unsafe-inline'"]
    },
  },
}));


// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow all origins in development
    if (config.nodeEnv === 'development') {
      return callback(null, true);
    }
    
    // In production, you can specify allowed origins
    const allowedOrigins = [
      config.frontendUrl, 
      'http://localhost:3000',
      'http://localhost:5173', // Vite default port
      'http://127.0.0.1:5173',
      'http://localhost:5000'
    ];
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    statusCode: 429
  }
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Campus Navigation API is running',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/uploads', uploadRoutes);

// Handle client-side routing - serve index.html for non-API routes
app.get('*', (req, res) => {
  // If it's an API route, return 404 JSON
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      success: false,
      message: 'API route not found',
      statusCode: 404
    });
  }
  
  // For all other routes, serve the frontend
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API 404 handler for remaining API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found',
    statusCode: 404
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors,
      statusCode: 400
    });
  }
  
  // Mongoose duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`,
      statusCode: 400
    });
  }
  
  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      statusCode: 401
    });
  }
  
  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired',
      statusCode: 401
    });
  }
  
  // Default error
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal Server Error',
    statusCode: error.statusCode || 500
  });
});

// Start server
const PORT = config.port;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
🚀 Campus Navigation API Server is running!
📍 Environment: ${config.nodeEnv}
🌐 Port: ${PORT}
📊 Database: ${config.mongodbUri}
🔒 JWT Secret: ${config.jwtSecret ? 'Set' : 'Not Set'}
⏰ Started at: ${new Date().toISOString()}
  `);
});

module.exports = app;

