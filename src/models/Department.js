const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Department name is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Department name cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  head: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  locations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location'
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual for location count
departmentSchema.virtual('locationCount', {
  ref: 'Location',
  localField: '_id',
  foreignField: 'department',
  count: true
});

// Ensure virtual fields are serialized
departmentSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Department', departmentSchema);

