const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.log('⚠️  MongoDB URI not provided - running in test mode without database');
      return;
    }
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('⚠️  Database connection error:', error.message);
    console.log('🔄 Continuing without database for testing purposes...');
    // Don't exit process for testing - just continue without DB
  }
};

module.exports = connectDB;

