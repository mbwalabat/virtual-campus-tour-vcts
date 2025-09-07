import { useState, useEffect } from 'react'
import { X, Mail, User, Building, Shield, Lock, Info } from 'lucide-react'
import { locationsAPI } from '../../services/api.js';

const UserModal = ({ user, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'departmentAdmin',
    department: user?.department || '',
    faculty: user?.faculty || '',
    password: '',
    assignedLocations: user?.assignedLocations || []
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [allLocations, setAllLocations] = useState([]);

  useEffect(() => {
    // Fetch all locations for assignment
    locationsAPI.getAllLocations().then(res => {
      setAllLocations(res.data.data.locations || []);
    });
  }, []);

  const departments = [
    'Computer Science',
    'Agriculture',
    'Library',
    'Hostels',
    'Food Technology',
    'Animal Husbandry',
    'Plant Breeding & Genetics',
    'Agricultural Engineering',
    'Economics & Management'
  ]

  const faculties = [
    'Faculty of Engineering',
    'Faculty of Agriculture',
    'Faculty of Science',
    'Faculty of Management',
    'Faculty of Arts',
    'Faculty of Medicine',
    'Faculty of Law',
    'Faculty of Education'
  ]

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (formData.role === 'departmentAdmin' && !formData.department) {
      newErrors.department = 'Department is required for department admins'
    }
    if (formData.role === 'departmentAdmin' && !formData.faculty) {
      newErrors.faculty = 'Faculty is required for department admins'
    }
    if (!user && !formData.password) {
      newErrors.password = 'Password is required for new users'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    try {
      const userData = {
        ...formData,
        department: formData.role === 'superAdmin' ? null : formData.department,
        faculty: formData.role === 'superAdmin' ? null : formData.faculty,
        assignedLocations: formData.role === 'departmentAdmin' ? formData.assignedLocations : [],
        password: !user ? formData.password || 'defaultPassword123' : undefined
      }
      await onSave(userData)
    } catch (error) {
      console.error('Error saving user:', error)
      alert('Failed to save user. Please check console.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
    if (name === 'role' && value === 'superAdmin') {
      setFormData((prev) => ({ ...prev, department: '', faculty: '' }))
      setErrors((prev) => ({ ...prev, department: '', faculty: '' }))
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50 rounded-t-xl">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {user ? 'Edit User' : 'Add New User'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {user ? 'Update user information' : 'Create a new user account'}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              <span className="flex items-center gap-2">
                <User size={16} /> Full Name
              </span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                <Info size={14} /> {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              <span className="flex items-center gap-2">
                <Mail size={16} /> Email Address
              </span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                <Info size={14} /> {errors.email}
              </p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              <span className="flex items-center gap-2">
                <Shield size={16} /> Role
              </span>
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            >
              <option value="departmentAdmin">Department Admin</option>
              <option value="superAdmin">Super Admin</option>
            </select>
          </div>

          {/* Department (only for departmentAdmin) */}
          {formData.role === 'departmentAdmin' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <span className="flex items-center gap-2">
                  <Building size={16} /> Department
                </span>
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                  errors.department ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {errors.department && (
                <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                  <Info size={14} /> {errors.department}
                </p>
              )}
            </div>
          )}

          {/* Faculty (only for departmentAdmin) */}
          {formData.role === 'departmentAdmin' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <span className="flex items-center gap-2">
                  <Building size={16} /> Faculty
                </span>
              </label>
              <select
                name="faculty"
                value={formData.faculty}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                  errors.faculty ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Faculty</option>
                {faculties.map((faculty) => (
                  <option key={faculty} value={faculty}>
                    {faculty}
                  </option>
                ))}
              </select>
              {errors.faculty && (
                <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                  <Info size={14} /> {errors.faculty}
                </p>
              )}
            </div>
          )}

          {/* Assign Locations (only for departmentAdmin) */}
          {formData.role === 'departmentAdmin' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <span className="flex items-center gap-2">
                  <Building size={16} /> Assign Locations
                </span>
              </label>
              <select
                name="assignedLocations"
                multiple
                value={formData.assignedLocations}
                onChange={e => {
                  const options = Array.from(e.target.selectedOptions, opt => opt.value);
                  setFormData(prev => ({ ...prev, assignedLocations: options }));
                }}
                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              >
                {allLocations.map(loc => (
                  <option key={loc._id} value={loc._id}>{loc.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Password (only for new users) */}
          {!user && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <span className="flex items-center gap-2">
                  <Lock size={16} /> Password
                </span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                  <Info size={14} /> {errors.password}
                </p>
              )}
            </div>
          )}

          {/* Role Info */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
              <Info size={16} />
              {formData.role === 'superAdmin' ? 'Super Admin Permissions' : 'Department Admin Permissions'}
            </h3>
            {formData.role === 'superAdmin' ? (
              <ul className="text-sm text-blue-700 space-y-1">
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>Full system access</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>Manage all users & departments</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>Global content management</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>System settings configuration</span>
                </li>
              </ul>
            ) : (
              <ul className="text-sm text-blue-700 space-y-1">
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>Manage assigned department locations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>Upload & edit media</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>Update department information</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>View department statistics</span>
                </li>
              </ul>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 py-2.5 px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="flex-1 py-2.5 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                  Processing...
                </span>
              ) : user ? (
                'Update User'
              ) : (
                'Create User'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserModal