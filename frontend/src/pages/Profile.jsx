import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Building, Shield, Edit3, Save, X } from 'lucide-react';
import AdminLayout from '../components/Admin/AdminLayout';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    department: user?.department || ''
  });
  const [loading, setLoading] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      department: user?.department || ''
    });
    setIsEditing(false);
  };

  const handleSave = async () => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would update the user in your backend
      // For now, we'll just show success
      setIsEditing(false);
      
      // You might want to update the auth context here
      // updateUser(formData);
      
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getRoleDisplay = (role) => {
    switch (role) {
      case 'superAdmin':
        return 'Super Administrator';
      case 'departmentAdmin':
        return 'Department Administrator';
      default:
        return 'Administrator';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'superAdmin':
        return 'text-red-700 bg-red-100';
      case 'departmentAdmin':
        return 'text-blue-700 bg-blue-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        <div className="card">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Profile Settings</h1>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="btn btn-primary flex items-center gap-2"
              >
                <Edit3 size={16} />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="btn btn-outline flex items-center gap-2"
                >
                  <X size={16} />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="btn btn-primary flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Profile Content */}
          <div className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-2xl">
                  {user?.name?.charAt(0) || 'A'}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {user?.name}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user?.role)}`}>
                    <Shield size={14} />
                    {getRoleDisplay(user?.role)}
                  </span>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <User className="inline w-4 h-4 mr-2" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Enter your full name"
                  />
                ) : (
                  <div className="py-2 px-3 bg-gray-50 rounded-lg text-gray-800">
                    {user?.name}
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <Mail className="inline w-4 h-4 mr-2" />
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Enter your email address"
                  />
                ) : (
                  <div className="py-2 px-3 bg-gray-50 rounded-lg text-gray-800">
                    {user?.email}
                  </div>
                )}
              </div>

              {/* Role */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <Shield className="inline w-4 h-4 mr-2" />
                  Role
                </label>
                <div className="py-2 px-3 bg-gray-50 rounded-lg text-gray-800">
                  {getRoleDisplay(user?.role)}
                </div>
                <p className="text-xs text-gray-500">
                  Role cannot be changed. Contact Super Admin for role updates.
                </p>
              </div>

              {/* Department */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <Building className="inline w-4 h-4 mr-2" />
                  Department
                </label>
                <div className="py-2 px-3 bg-gray-50 rounded-lg text-gray-800">
                  {user?.department || 'All Departments'}
                </div>
                {user?.role === 'departmentAdmin' && (
                  <p className="text-xs text-gray-500">
                    You can only manage locations assigned to you by the super admin.
                  </p>
                )}
              </div>
            </div>

            {/* Account Information */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-600">Account Status</label>
                  <div>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium text-green-700 bg-green-100">
                      Active
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-600">Last Login</label>
                  <div className="text-gray-800">
                    {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                  </div>
                </div>
              </div>
            </div>

            {/* Permissions */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Permissions</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-800">Manage Locations</span>
                  <span className="text-xs text-green-600 font-medium">Allowed</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-800">Upload Media</span>
                  <span className="text-xs text-green-600 font-medium">Allowed</span>
                </div>
                {user?.role === 'superAdmin' && (
                  <>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-800">User Management</span>
                      <span className="text-xs text-green-600 font-medium">Allowed</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-800">System Configuration</span>
                      <span className="text-xs text-green-600 font-medium">Allowed</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Profile;