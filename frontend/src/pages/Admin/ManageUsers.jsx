import { useState, useEffect } from 'react';
import {
  Plus,
  Edit3,
  Trash2,
  Search,
  Filter,
  UserCheck,
  UserX,
  Shield,
  Mail,
  Calendar
} from 'lucide-react';
import AdminLayout from '../../components/Admin/AdminLayout';
import UserModal from '../../components/Admin/UserModal';
import { usersAPI } from '../../services/api.js';
import { useAuth } from '../../contexts/AuthContext';

const ManageUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
console.log("zee");

const fetchUsers = async () => {
  try {
    setLoading(true);
    setError(null);
    const params = {
      page: 1,
      limit: 10,
      ...(filterRole !== 'all' && { role: filterRole }),
      ...(searchTerm && { search: searchTerm })
    };

    const response = await usersAPI.getAllUsers(params);
    setUsers(response.data.data.users);
  } catch (error) {
    console.error('Error fetching users:', error);
    setError('Failed to load users. Please try again.');
  } finally {
    setLoading(false);
  }
};



  useEffect(() => {
    fetchUsers();
  }, [filterRole, filterStatus, searchTerm]);

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.faculty?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === 'all' || user.role === filterRole;
  const matchesStatus = filterStatus === 'all' || (filterStatus === 'active' ? user.isActive : !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAddUser = () => {
    console.log("add user");
    
    setEditingUser(null);
    setShowUserModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowUserModal(true);
  };

  // Delete user
const handleDeleteUser = async (userId) => {
  if (window.confirm('Are you sure you want to delete this user?')) {
    try {
      await usersAPI.deleteUser(userId);
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }
};


// Toggle user status
const handleToggleStatus = async (userId) => {
  try {
    const user = users.find(u => u._id === userId);
    if (user.isActive) {
      await usersAPI.makeInactive(userId);
    } else {
      await usersAPI.makeActive(userId);
    }
    fetchUsers(); // Refresh the list
  } catch (error) {
    console.error('Error updating status:', error);
  }
};


const handleSaveUser = async (userData) => {
  try {
    if (editingUser) {
      await usersAPI.updateUser(editingUser._id, userData);
    } else {
      await usersAPI.createUser(userData);
    }

    // Refresh the user list after successful creation/update
    await fetchUsers();
    setShowUserModal(false);
    setEditingUser(null);
  } catch (error) {
    console.error('Error saving user:', error);
    throw error; // Re-throw the error to be caught in UserModal
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

  const getStatusColor = (isActive) => {
  return isActive ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100';
};

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-600">Loading users...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">
            <Shield size={48} className="mx-auto mb-2" />
            <h3 className="text-lg font-semibold">Error Loading Users</h3>
            <p className="text-sm">{error}</p>
          </div>
          <button 
            onClick={fetchUsers}
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
            <p className="text-gray-600 mt-1">Manage admin accounts and permissions</p>
          </div>
          <button 
            onClick={handleAddUser}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Add User
          </button>
        </div>

        {/* Filters */}
        <div className="card">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search users by name, email, department, or faculty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Role Filter */}
            <div className="relative">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                <option value="superAdmin">Super Admin</option>
                <option value="departmentAdmin">Department Admin</option>
              </select>
              <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="text-left">User</th>
                  <th className="text-left">Role</th>
                  <th className="text-left">Department</th>
                  <th className="text-left">Faculty</th>
                  <th className="text-left">Status</th>
                  <th className="text-left">Last Login</th>
                  <th className="text-left">Created</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
  {filteredUsers.map((user) => (
    <tr key={user._id} className="hover:bg-gray-50">
      {/* User (Name + Email) */}
      <td>
        <div>
          <p className="font-medium text-gray-800">{user.name}</p>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <Mail size={14} className="text-gray-400" /> {user.email}
          </p>
        </div>
      </td>

      {/* Role */}
      <td>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
            user.role
          )}`}
        >
          {user.role}
        </span>
      </td>

      {/* Department */}
      <td>{user.department || "-"}</td>

      {/* Faculty */}
      <td>{user.faculty || "-"}</td>

      {/* Status */}
      <td>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            user.isActive
          )}`}
        >
          {user.isActive ? "Active" : "Inactive"}
        </span>
      </td>

      {/* Last Login */}
      <td>
        {user.lastLogin
          ? new Date(user.lastLogin).toLocaleString()
          : "Never"}
      </td>

      {/* Created */}
      <td>{new Date(user.createdAt).toLocaleDateString()}</td>

      {/* Actions */}
      <td>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleToggleStatus(user._id)}
            className={`p-2 rounded-lg transition-colors ${
              user.isActive
                ? "text-red-600 hover:bg-red-50"
                : "text-green-600 hover:bg-green-50"
            }`}
            title={user.isActive ? "Deactivate User" : "Activate User"}
            disabled={user.role === "superAdmin"}
          >
            {user.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
          </button>
          <button
            onClick={() => handleEditUser(user)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit User"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={() => handleDeleteUser(user._id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete User"
            disabled={user.role === "superAdmin"}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  ))}
</tbody>

            </table>

            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">
                  <Shield size={48} className="mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-1">No Users Found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <div className="card text-center">
    <div className="text-2xl font-bold text-gray-800 mb-1">
      {users.filter(u => u.isActive).length}
    </div>
    <div className="text-sm text-gray-600">Active Users</div>
  </div>
  <div className="card text-center">
    <div className="text-2xl font-bold text-gray-800 mb-1">
      {users.filter(u => u.role === 'departmentAdmin').length}
    </div>
    <div className="text-sm text-gray-600">Department Admins</div>
  </div>
  <div className="card text-center">
    <div className="text-2xl font-bold text-gray-800 mb-1">
      {users.filter(u => u.role === 'superAdmin').length}
    </div>
    <div className="text-sm text-gray-600">Super Admins</div>
  </div>
</div>

      </div>

      {/* User Modal */}
      {showUserModal && (
        <UserModal
          user={editingUser}
          onSave={handleSaveUser}
          onClose={() => {
            setShowUserModal(false);
            setEditingUser(null);
          }}
        />
      )}
    </AdminLayout>
  );
};

export default ManageUsers;