const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Location name is required'],
    trim: true,
    maxlength: [200, 'Location name cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Location description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  department: {
    type: String,
    required: [true, 'Department is required']
  },
  category: {
    type: String,
    enum: ['academic', 'administration', 'research', 'accommodation', 'dining', 'recreation', 'events'],
    default: 'academic'
  },
  coordinates: {
    latitude: {
      type: Number,
      required: [true, 'Latitude is required'],
      min: [-90, 'Latitude must be between -90 and 90'],
      max: [90, 'Latitude must be between -90 and 90']
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude is required'],
      min: [-180, 'Longitude must be between -180 and 180'],
      max: [180, 'Longitude must be between -180 and 180']
    }
  },
  images: [{
    type: String,
    validate: {
      validator: function(v) {
        return /^(http|https):\/\//i.test(v) || /\.(jpg|jpeg|png|gif)$/i.test(v);
      },
      message: 'Invalid image file format'
    }
  }],
  audio: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^(http|https):\/\//i.test(v) || /\.(mp3|wav|ogg)$/i.test(v);
      },
      message: 'Invalid audio file format'
    }
  },
  video: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^(http|https):\/\//i.test(v) || /\.(mp4|webm|mov)$/i.test(v);
      },
      message: 'Invalid video file format'
    }
  },
  view360: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^(http|https):\/\//i.test(v) || /\.(jpg|jpeg|png|gif|mp4|webm)$/i.test(v);
      },
      message: 'Invalid 360 view file format'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for geospatial queries
locationSchema.index({ 'coordinates.latitude': 1, 'coordinates.longitude': 1 });

// Index for text search
locationSchema.index({ name: 'text', description: 'text', department: 'text' });

module.exports = mongoose.model('Location', locationSchema);

