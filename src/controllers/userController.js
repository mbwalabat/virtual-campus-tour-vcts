const User = require('../models/User');
const { formatSuccessResponse, formatErrorResponse, getPaginationOptions } = require('../utils/helpers');

// Get all users (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, department, search } = req.query;
    const { skip, limit: limitNumber } = getPaginationOptions(page, limit);

    // Build filter
    const filter = { isActive: true };
    
    if (role) {
      filter.role = role;
    }
    
    if (department) {
      filter.department = new RegExp(department, 'i');
    }
    
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }

    // Get users with pagination
    const users = await User.find(filter)
      .skip(skip)
      .limit(limitNumber)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    res.json(
      formatSuccessResponse({
        users,
        pagination: {
          page: parseInt(page),
          limit: limitNumber,
          total,
          pages: Math.ceil(total / limitNumber)
        }
      }, 'Users retrieved successfully')
    );
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json(
      formatErrorResponse('Server error retrieving users', 500)
    );
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id);
    if (!user || !user.isActive) {
      return res.status(404).json(
        formatErrorResponse('User not found', 404)
      );
    }

    res.json(
      formatSuccessResponse(user, 'User retrieved successfully')
    );
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json(
      formatErrorResponse('Server error retrieving user', 500)
    );
  }
};

// Create new user (Admin only)
const createUser = async (req, res) => {
  try {
    const { name, email, password, role, department, faculty, assignedLocations } = req.body;
    console.log('Creating user with data:', { name, email, role, department, faculty, assignedLocations }); // Log incoming data

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json(
        formatErrorResponse('User with this email already exists', 400)
      );
    }

    // Only super admin can create super admin users
    if (role === 'superAdmin' && req.user.role !== 'superAdmin') {
      return res.status(403).json(
        formatErrorResponse('Only super admin can create super admin users', 403)
      );
    }

    const user = new User({
      name,
      email,
      password,
      role: role || 'user',
      department,
      faculty,
      assignedLocations
    });

    await user.save();
    console.log('User saved successfully:', user); // Log saved user

    res.status(201).json(
      formatSuccessResponse(user, 'User created successfully')
    );
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json(
      formatErrorResponse('Server error creating user', 500)
    );
  }
};

// Update user (Admin only)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, department, faculty, isActive, assignedLocations } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json(
        formatErrorResponse('User not found', 404)
      );
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json(
          formatErrorResponse('Email already in use', 400)
        );
      }
    }

    // Only super admin can modify super admin users or assign super admin role
    if ((user.role === 'superAdmin' || role === 'superAdmin') && req.user.role !== 'superAdmin') {
      return res.status(403).json(
        formatErrorResponse('Only super admin can modify super admin users', 403)
      );
    }

    // Department admin can only modify users in their department
    if (req.user.role === 'departmentAdmin') {
      if (user.department !== req.user.department) {
        return res.status(403).json(
          formatErrorResponse('You can only modify users in your department', 403)
        );
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (department) updateData.department = department;
    if (faculty) updateData.faculty = faculty;
    if (typeof isActive === 'boolean') updateData.isActive = isActive;
    // Only super admin can change assigned locations
    if (req.user.role === 'superAdmin' && Array.isArray(assignedLocations)) {
      updateData.assignedLocations = assignedLocations;
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json(
      formatSuccessResponse(updatedUser, 'User updated successfully')
    );
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json(
      formatErrorResponse('Server error updating user', 500)
    );
  }
};

const makeInactive = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json(
        formatErrorResponse('User not found', 404)
      );
    }
    user.isActive = false;
    await user.save();
    res.json(
      formatSuccessResponse(null, 'User marked as inactive')
    );
  } catch (error) {
    console.error('Make inactive error:', error);
    res.status(500).json(
      formatErrorResponse('Server error', 500)
    );
  }
};


const makeActive = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json(
        formatErrorResponse('User not found', 404)
      );
    }
    user.isActive = true;
    await user.save();
    res.json(
      formatSuccessResponse(null, 'User marked as active')
    );
  } catch (error) {
    console.error('Make active error:', error);
    res.status(500).json(
      formatErrorResponse('Server error', 500)
    );
  }
};


const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json(
        formatErrorResponse('User not found', 404)
      );
    }
    if (user.role === 'superAdmin') {
      return res.status(403).json(
        formatErrorResponse('Cannot delete super admin users', 403)
      );
    }
    await User.findByIdAndDelete(id);
    res.json(
      formatSuccessResponse(null, 'User deleted successfully')
    );
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json(
      formatErrorResponse('Server error deleting user', 500)
    );
  }
};




// Get user statistics (Admin only)
const getUserStats = async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $match: { isActive: true }
      },
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalUsers = await User.countDocuments({ isActive: true });

    res.json(
      formatSuccessResponse({
        totalUsers,
        roleDistribution: stats
      }, 'User statistics retrieved successfully')
    );
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json(
      formatErrorResponse('Server error retrieving user statistics', 500)
    );
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserStats,
  makeInactive,
  makeActive
};

