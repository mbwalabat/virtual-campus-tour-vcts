const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { formatSuccessResponse, formatErrorResponse } = require('../utils/helpers');

// Register new user
const register = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json(
        formatErrorResponse('User with this email already exists', 400)
      );
    }

    // Create new user with default role 'user'
    const user = new User({
      name,
      email,
      password,
      role: role || 'user', // Default role for visitors
      department: department || null // Optional department
    });

    await user.save();

    // Generate token
    const token = generateToken({ id: user._id });

    // Remove password from response
    const userResponse = { ...user.toObject() };
    delete userResponse.password;

    res.status(201).json(
      formatSuccessResponse({
        user: userResponse,
        token
      }, 'User registered successfully')
    );
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json(
      formatErrorResponse('Server error during registration', 500)
    );
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.isActive) {
      return res.status(401).json(
        formatErrorResponse('Invalid credentials', 401)
      );
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json(
        formatErrorResponse('Invalid credentials', 401)
      );
    }

    // Update lastLogin
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken({ id: user._id });

    // Remove password from response
    user.password = undefined;

    res.json(
      formatSuccessResponse({
        user,
        token
      }, 'Login successful')
    );
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json(
      formatErrorResponse('Server error during login', 500)
    );
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    res.json(
      formatSuccessResponse(user, 'Profile retrieved successfully')
    );
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json(
      formatErrorResponse('Server error retrieving profile', 500)
    );
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { name, email, department } = req.body;
    const userId = req.user._id;

    // Check if email is being changed and if it's already taken
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json(
          formatErrorResponse('Email already in use', 400)
        );
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (department) updateData.department = department;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    res.json(
      formatSuccessResponse(user, 'Profile updated successfully')
    );
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json(
      formatErrorResponse('Server error updating profile', 500)
    );
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    // Get user with password
    const user = await User.findById(userId).select('+password');
    
    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json(
        formatErrorResponse('Current password is incorrect', 400)
      );
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json(
      formatSuccessResponse(null, 'Password changed successfully')
    );
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json(
      formatErrorResponse('Server error changing password', 500)
    );
  }
};

// Logout (client-side token removal)
const logout = async (req, res) => {
  res.json(
    formatSuccessResponse(null, 'Logout successful')
  );
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout
};

