const Department = require('../models/Department');
const User = require('../models/User');
const Location = require('../models/Location');
const { formatSuccessResponse, formatErrorResponse, getPaginationOptions } = require('../utils/helpers');

// Get all departments
const getAllDepartments = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, isActive } = req.query;
    const { skip, limit: limitNumber } = getPaginationOptions(page, limit);

    // Build filter
    const filter = {};
    
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    if (typeof isActive === 'string') {
      filter.isActive = isActive === 'true';
    } else {
      filter.isActive = true; // Default to active departments
    }

    // Get departments with pagination
    const departments = await Department.find(filter)
      .populate('head', 'name email')
      .populate('locationCount')
      .skip(skip)
      .limit(limitNumber)
      .sort({ name: 1 });

    const total = await Department.countDocuments(filter);

    res.json(
      formatSuccessResponse({
        departments,
        pagination: {
          page: parseInt(page),
          limit: limitNumber,
          total,
          pages: Math.ceil(total / limitNumber)
        }
      }, 'Departments retrieved successfully')
    );
  } catch (error) {
    console.error('Get all departments error:', error);
    res.status(500).json(
      formatErrorResponse('Server error retrieving departments', 500)
    );
  }
};

// Get department by ID
const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const department = await Department.findById(id)
      .populate('head', 'name email')
      .populate('locations', 'name description coordinates isActive');
      
    if (!department) {
      return res.status(404).json(
        formatErrorResponse('Department not found', 404)
      );
    }

    res.json(
      formatSuccessResponse(department, 'Department retrieved successfully')
    );
  } catch (error) {
    console.error('Get department by ID error:', error);
    res.status(500).json(
      formatErrorResponse('Server error retrieving department', 500)
    );
  }
};

// Create new department (Super Admin only)
const createDepartment = async (req, res) => {
  try {
    const { name, description, headId } = req.body;

    // Check if department with same name already exists
    const existingDepartment = await Department.findOne({ name });
    if (existingDepartment) {
      return res.status(400).json(
        formatErrorResponse('Department with this name already exists', 400)
      );
    }

    // Validate head user if provided
    if (headId) {
      const headUser = await User.findById(headId);
      if (!headUser || !headUser.isActive) {
        return res.status(400).json(
          formatErrorResponse('Invalid department head user', 400)
        );
      }
    }

    const department = new Department({
      name,
      description,
      head: headId || null
    });

    await department.save();
    await department.populate('head', 'name email');

    res.status(201).json(
      formatSuccessResponse(department, 'Department created successfully')
    );
  } catch (error) {
    console.error('Create department error:', error);
    res.status(500).json(
      formatErrorResponse('Server error creating department', 500)
    );
  }
};

// Update department (Super Admin only)
const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, headId, isActive } = req.body;

    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json(
        formatErrorResponse('Department not found', 404)
      );
    }

    // Check if name is being changed and if it's already taken
    if (name && name !== department.name) {
      const existingDepartment = await Department.findOne({ name });
      if (existingDepartment) {
        return res.status(400).json(
          formatErrorResponse('Department name already in use', 400)
        );
      }
    }

    // Validate head user if provided
    if (headId) {
      const headUser = await User.findById(headId);
      if (!headUser || !headUser.isActive) {
        return res.status(400).json(
          formatErrorResponse('Invalid department head user', 400)
        );
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (headId !== undefined) updateData.head = headId || null;
    if (typeof isActive === 'boolean') updateData.isActive = isActive;

    const updatedDepartment = await Department.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('head', 'name email');

    res.json(
      formatSuccessResponse(updatedDepartment, 'Department updated successfully')
    );
  } catch (error) {
    console.error('Update department error:', error);
    res.status(500).json(
      formatErrorResponse('Server error updating department', 500)
    );
  }
};

// Delete department (Super Admin only)
const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json(
        formatErrorResponse('Department not found', 404)
      );
    }

    // Check if department has associated locations
    const locationCount = await Location.countDocuments({ 
      department: department.name,
      isActive: true 
    });
    
    if (locationCount > 0) {
      return res.status(400).json(
        formatErrorResponse('Cannot delete department with active locations', 400)
      );
    }

    // Check if department has associated users
    const userCount = await User.countDocuments({ 
      department: department.name,
      isActive: true 
    });
    
    if (userCount > 0) {
      return res.status(400).json(
        formatErrorResponse('Cannot delete department with active users', 400)
      );
    }

    await Department.findByIdAndDelete(id);

    res.json(
      formatSuccessResponse(null, 'Department deleted successfully')
    );
  } catch (error) {
    console.error('Delete department error:', error);
    res.status(500).json(
      formatErrorResponse('Server error deleting department', 500)
    );
  }
};

// Get department statistics
const getDepartmentStats = async (req, res) => {
  try {
    const departments = await Department.find({ isActive: true });
    
    const stats = await Promise.all(
      departments.map(async (dept) => {
        const locationCount = await Location.countDocuments({ 
          department: dept.name,
          isActive: true 
        });
        
        const userCount = await User.countDocuments({ 
          department: dept.name,
          isActive: true 
        });

        return {
          department: dept.name,
          locationCount,
          userCount,
          head: dept.head
        };
      })
    );

    const totalDepartments = departments.length;

    res.json(
      formatSuccessResponse({
        totalDepartments,
        departmentStats: stats
      }, 'Department statistics retrieved successfully')
    );
  } catch (error) {
    console.error('Get department stats error:', error);
    res.status(500).json(
      formatErrorResponse('Server error retrieving department statistics', 500)
    );
  }
};

// Get users by department
const getDepartmentUsers = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const { skip, limit: limitNumber } = getPaginationOptions(page, limit);

    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json(
        formatErrorResponse('Department not found', 404)
      );
    }

    const users = await User.find({ 
      department: department.name,
      isActive: true 
    })
    .skip(skip)
    .limit(limitNumber)
    .sort({ name: 1 });

    const total = await User.countDocuments({ 
      department: department.name,
      isActive: true 
    });

    res.json(
      formatSuccessResponse({
        users,
        pagination: {
          page: parseInt(page),
          limit: limitNumber,
          total,
          pages: Math.ceil(total / limitNumber)
        }
      }, 'Department users retrieved successfully')
    );
  } catch (error) {
    console.error('Get department users error:', error);
    res.status(500).json(
      formatErrorResponse('Server error retrieving department users', 500)
    );
  }
};

// Get locations by department
const getDepartmentLocations = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const { skip, limit: limitNumber } = getPaginationOptions(page, limit);

    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json(
        formatErrorResponse('Department not found', 404)
      );
    }

    const locations = await Location.find({ 
      department: department.name,
      isActive: true 
    })
    .populate('createdBy', 'name email')
    .skip(skip)
    .limit(limitNumber)
    .sort({ name: 1 });

    const total = await Location.countDocuments({ 
      department: department.name,
      isActive: true 
    });

    res.json(
      formatSuccessResponse({
        locations,
        pagination: {
          page: parseInt(page),
          limit: limitNumber,
          total,
          pages: Math.ceil(total / limitNumber)
        }
      }, 'Department locations retrieved successfully')
    );
  } catch (error) {
    console.error('Get department locations error:', error);
    res.status(500).json(
      formatErrorResponse('Server error retrieving department locations', 500)
    );
  }
};

module.exports = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentStats,
  getDepartmentUsers,
  getDepartmentLocations
};

