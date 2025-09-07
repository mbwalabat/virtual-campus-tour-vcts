const Location = require('../models/Location');
const { formatSuccessResponse, formatErrorResponse, getPaginationOptions, deleteFile } = require('../utils/helpers');
const path = require('path');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Get all locations
const getAllLocations = async (req, res) => {
  try {
    const { page = 1, limit = 10, department, search, isActive } = req.query;
    const { skip, limit: limitNumber } = getPaginationOptions(page, limit);

    // Build filter
    const filter = {};
    
    if (department) {
      filter.department = new RegExp(department, 'i');
    }
    
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    if (typeof isActive === 'string') {
      filter.isActive = isActive === 'true';
    } else {
      filter.isActive = true; // Default to active locations
    }

    // Get locations with pagination
    const locations = await Location.find(filter)
      .populate('createdBy', 'name email')
      .skip(skip)
      .limit(limitNumber)
      .sort({ createdAt: -1 });

    const total = await Location.countDocuments(filter);

    res.json(
      formatSuccessResponse({
        locations,
        pagination: {
          page: parseInt(page),
          limit: limitNumber,
          total,
          pages: Math.ceil(total / limitNumber)
        }
      }, 'Locations retrieved successfully')
    );
  } catch (error) {
    console.error('Get all locations error:', error);
    res.status(500).json(
      formatErrorResponse('Server error retrieving locations', 500)
    );
  }
};

// Get location by ID
const getLocationById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const location = await Location.findById(id)
      .populate('createdBy', 'name email');
      
    if (!location) {
      return res.status(404).json(
        formatErrorResponse('Location not found', 404)
      );
    }

    res.json(
      formatSuccessResponse(location, 'Location retrieved successfully')
    );
  } catch (error) {
    console.error('Get location by ID error:', error);
    res.status(500).json(
      formatErrorResponse('Server error retrieving location', 500)
    );
  }
};

// creaet new loaction
const createLocation = async (req, res) => {
  try {
    let { name, description, department, coordinates, category, imageUrls, audioUrl, videoUrl, view360Url } = req.body;

    console.log('Create location request data:', { imageUrls, audioUrl, videoUrl, view360Url });

    // Parse coordinates if it's a string
    if (typeof coordinates === "string") {
  try {
    coordinates = JSON.parse(coordinates);
  } catch {
    return res.status(400).json(formatErrorResponse("Invalid coordinates format", 400));
  }
}
    // Check for existing location
    const existingLocation = await Location.findOne({ name });
    if (existingLocation) {
      return res.status(400).json(formatErrorResponse('Location with this name already exists', 400));
    }

    // Department restriction
    if (req.user.role === 'departmentAdmin' && department !== req.user.department) {
      return res.status(403).json(formatErrorResponse('You can only create locations for your department', 403));
    }

    const location = new Location({
      name,
      description,
      department,
      coordinates,
      category: category || 'academic',
      createdBy: req.user._id
    });

    // Add media URLs if provided
    if (imageUrls && Array.isArray(imageUrls)) {
      location.images = imageUrls;
    }
    if (audioUrl) {
      location.audio = audioUrl;
    }
    if (videoUrl) {
      location.video = videoUrl;
    }
    if (view360Url) {
      location.view360 = view360Url;
    }

    await location.save();
    await location.populate('createdBy', 'name email');

    res.status(201).json(formatSuccessResponse(location, 'Location created successfully'));
  } catch (error) {
    console.error('Create location error:', error);
    res.status(500).json(formatErrorResponse('Server error creating location', 500));
  }
};


// Update location (Admin only)
const updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, department, coordinates, isActive, category, imageUrls, audioUrl, videoUrl, view360Url } = req.body;

    console.log('Update location request data:', { imageUrls, audioUrl, videoUrl, view360Url });

    const location = await Location.findById(id);
    if (!location) {
      return res.status(404).json(
        formatErrorResponse('Location not found', 404)
      );
    }

    // Department admin restriction based on assigned locations only
    if (req.user.role === 'departmentAdmin') {
      const isAssigned = (req.user.assignedLocations || []).map(String).includes(location._id.toString());
      if (!isAssigned) {
        return res.status(403).json(
          formatErrorResponse('You can only modify locations assigned to you', 403)
        );
      }
    }

    // Check if name is being changed and if it's already taken
    if (name && name !== location.name) {
      const existingLocation = await Location.findOne({ name });
      if (existingLocation) {
        return res.status(400).json(
          formatErrorResponse('Location name already in use', 400)
        );
      }
    }

    // Prevent department admins from changing department
    if (req.user.role === 'departmentAdmin' && department && department !== location.department) {
      return res.status(403).json(
        formatErrorResponse('Department admins cannot change a location\'s department', 403)
      );
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    // Only super admin can change department
    if (department && req.user.role === 'superAdmin') updateData.department = department;
    if (coordinates) updateData.coordinates = coordinates;
    if (typeof isActive === 'boolean') updateData.isActive = isActive;

    // Update media URLs if provided
    if (imageUrls && Array.isArray(imageUrls)) {
      updateData.images = imageUrls;
    }
    if (audioUrl !== undefined) {
      updateData.audio = audioUrl;
    }
    if (videoUrl !== undefined) {
      updateData.video = videoUrl;
    }
    if (view360Url !== undefined) {
      updateData.view360 = view360Url;
    }

    const updatedLocation = await Location.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    res.json(
      formatSuccessResponse(updatedLocation, 'Location updated successfully')
    );
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json(
      formatErrorResponse('Server error updating location', 500)
    );
  }
};

// Delete location (Admin only)
const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;

    const location = await Location.findById(id);
    if (!location) {
      return res.status(404).json(
        formatErrorResponse('Location not found', 404)
      );
    }

    // Department admin can only delete locations in their department
    if (req.user.role === 'departmentAdmin') {
      if (location.department !== req.user.department) {
        return res.status(403).json(
          formatErrorResponse('You can only delete locations in your department', 403)
        );
      }
    }

    // Delete associated files
    if (location.images && location.images.length > 0) {
      for (const image of location.images) {
        await deleteFile(path.join('./uploads/images', path.basename(image)));
      }
    }

    if (location.audio) {
      await deleteFile(path.join('./uploads/audio', path.basename(location.audio)));
    }

    if (location.view360) {
      await deleteFile(path.join('./uploads/360views', path.basename(location.view360)));
    }

    await Location.findByIdAndDelete(id);

    res.json(
      formatSuccessResponse(null, 'Location deleted successfully')
    );
  } catch (error) {
    console.error('Delete location error:', error);
    res.status(500).json(
      formatErrorResponse('Server error deleting location', 500)
    );
  }
};

const uploadLocationFiles = async (req, res) => {
  try {
    const { id } = req.params;
    const location = await Location.findById(id);
    if (!location) {
      return res.status(404).json(
        formatErrorResponse('Location not found', 404)
      );
    }

    // Department admin can only upload files for locations in their department
    if (req.user.role === 'departmentAdmin') {
      if (location.department !== req.user.department) {
        return res.status(403).json(
          formatErrorResponse('You can only upload files for locations in your department', 403)
        );
      }
    }

    const uploadToCloud = async (filePath, folder, resource_type = 'image') => {
      const res = await cloudinary.uploader.upload(filePath, { folder, resource_type });
      return res.secure_url;
    };

    const updateData = {};

    // Handle image uploads
    if (req.files && req.files.images) {
      const urls = [];
      for (const f of req.files.images) {
        const url = await uploadToCloud(f.path, 'locations/images', 'image');
        urls.push(url);
      }
      updateData.images = [...(location.images || []), ...urls];
    }

    // Handle audio upload
    if (req.files && req.files.audio && req.files.audio[0]) {
      const url = await uploadToCloud(req.files.audio[0].path, 'locations/audio', 'video'); // audio uses video type in Cloudinary
      updateData.audio = url;
    }

    // Handle video upload
    if (req.files && req.files.video && req.files.video[0]) {
      const url = await uploadToCloud(req.files.video[0].path, 'locations/video', 'video');
      updateData.video = url;
    }

    // Handle 360 view upload (as image)
    if (req.files && req.files.view360 && req.files.view360[0]) {
      const url = await uploadToCloud(req.files.view360[0].path, 'locations/view360', 'image');
      updateData.view360 = url;
    }

    const updatedLocation = await Location.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    res.json(
      formatSuccessResponse(updatedLocation, 'Files uploaded successfully')
    );
  } catch (error) {
    console.error('Upload location files error:', error);
    res.status(500).json(
      formatErrorResponse('Server error uploading files', 500)
    );
  }
};

// Get locations by department
const getLocationsByDepartment = async (req, res) => {
  try {
    const { department } = req.params;
    
    const locations = await Location.find({ 
      department: new RegExp(department, 'i'),
      isActive: true 
    })
    .populate('createdBy', 'name email')
    .sort({ name: 1 });

    res.json(
      formatSuccessResponse(locations, 'Department locations retrieved successfully')
    );
  } catch (error) {
    console.error('Get locations by department error:', error);
    res.status(500).json(
      formatErrorResponse('Server error retrieving department locations', 500)
    );
  }
};

// Get location statistics
const getLocationStats = async (req, res) => {
  try {
    const stats = await Location.aggregate([
      {
        $match: { isActive: true }
      },
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    const totalLocations = await Location.countDocuments({ isActive: true });

    res.json(
      formatSuccessResponse({
        totalLocations,
        departmentDistribution: stats
      }, 'Location statistics retrieved successfully')
    );
  } catch (error) {
    console.error('Get location stats error:', error);
    res.status(500).json(
      formatErrorResponse('Server error retrieving location statistics', 500)
    );
  }
};

module.exports = {
  getAllLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
  uploadLocationFiles,
  getLocationsByDepartment,
  getLocationStats
};



