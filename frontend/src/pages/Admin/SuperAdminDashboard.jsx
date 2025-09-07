import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Users, 
  MapPin, 
  Database, 
  Activity, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import AdminLayout from '../../components/Admin/AdminLayout';
import { usersAPI, locationsAPI, departmentsAPI } from '../../services/api.js';

const SuperAdminDashboard = () => {
  const { user } = useAuth();
  const [systemStats, setSystemStats] = useState([]);
  const [departmentStats, setDepartmentStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch real data from APIs
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all data in parallel
        const [usersResponse, locationsResponse, departmentsResponse] = await Promise.all([
          usersAPI.getUserStats(),
          locationsAPI.getLocationStats(),
          departmentsAPI.getDepartmentStats()
        ]);

        const users = usersResponse.data.data;
        const locations = locationsResponse.data.data;
        const departments = departmentsResponse.data.data;

        // Build system stats from real data
        const stats = [
          {
            label: 'Total Users',
            value: users.totalUsers?.toString() || '0',
            change: `+${users.newUsersThisWeek || 0} this week`,
            icon: <Users className="w-8 h-8" />,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
          },
          {
            label: 'Active Locations',
            value: locations.totalLocations?.toString() || '0',
            change: `+${locations.newLocationsThisWeek || 0} new locations`,
            icon: <MapPin className="w-8 h-8" />,
            color: 'text-green-600',
            bgColor: 'bg-green-100'
          },
          {
            label: 'Departments',
            value: departments.totalDepartments?.toString() || '0',
            change: `${departments.activeDepartments || 0} active`,
            icon: <TrendingUp className="w-8 h-8" />,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100'
          },
          {
            label: 'System Status',
            value: 'Online',
            change: 'All systems operational',
            icon: <Database className="w-8 h-8" />,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100'
          }
        ];

        setSystemStats(stats);
        setDepartmentStats(departments.departments || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusIcon = (isActive) => {
    return isActive ? 
      <CheckCircle className="w-4 h-4 text-green-500" /> : 
      <Clock className="w-4 h-4 text-yellow-500" />;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
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
            <AlertTriangle size={48} className="mx-auto mb-2" />
            <h3 className="text-lg font-semibold">Error Loading Dashboard</h3>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Super Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Complete system overview and management controls for SAU Virtual Campus Tour
          </p>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {systemStats.map((stat, index) => (
            <div key={index} className="card">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <div className={stat.color}>
                    {stat.icon}
                  </div>
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-gray-600 mb-2">
                  {stat.label}
                </div>
                <div className="text-xs text-gray-500">
                  {stat.change}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Department Overview */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Department Management</h2>
                <Link
                  to="/admin/users"
                  className="btn btn-primary text-sm"
                >
                  Manage Users
                </Link>
              </div>
              
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Department</th>
                      <th>Admin</th>
                      <th>Locations</th>
                      <th>Last Update</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departmentStats.map((dept, index) => (
                      <tr key={dept._id || index}>
                        <td>
                          <div className="font-medium text-gray-800">{dept.name}</div>
                        </td>
                        <td>
                          <div className="text-gray-600">{dept.description || 'No description'}</div>
                        </td>
                        <td>
                          <div className="text-center">
                            <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                              {dept.locationCount || 0}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="text-sm text-gray-500">
                            {dept.updatedAt ? new Date(dept.updatedAt).toLocaleDateString() : 'N/A'}
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(dept.isActive)}
                            <span className={`text-sm font-medium capitalize ${
                              dept.isActive ? 'text-green-700' : 'text-yellow-700'
                            }`}>
                              {dept.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* System Alerts & Quick Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  to="/admin/users"
                  className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Users className="text-blue-600" size={20} />
                    <div className="text-sm font-medium text-gray-800">
                      User Management
                    </div>
                  </div>
                </Link>

                <Link
                  to="/admin/locations"
                  className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="text-green-600" size={20} />
                    <div className="text-sm font-medium text-gray-800">
                      Global Location Management
                    </div>
                  </div>
                </Link>

                <button className="block w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <div className="flex items-center gap-3">
                    <Database className="text-purple-600" size={20} />
                    <div className="text-sm font-medium text-gray-800">
                      System Backup
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* System Status */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">System Status</h2>
              <div className="space-y-3">
                <div className="p-3 border border-green-200 bg-green-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-green-800 mb-1">
                        All Systems Operational
                      </div>
                      <div className="text-xs text-green-600">
                        Database, API, and Frontend are running normally
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SuperAdminDashboard;