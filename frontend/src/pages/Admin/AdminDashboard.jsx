import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { BarChart3, Users, MapPin, Settings, Calendar, TrendingUp } from 'lucide-react';
import AdminLayout from '../../components/Admin/AdminLayout';

const AdminDashboard = () => {
  const { user } = useAuth();

  // Mock statistics
  const stats = [
    {
      label: 'Total Locations',
      value: '24',
      change: '+2 this month',
      icon: <MapPin className="w-8 h-8" />,
      color: 'text-blue-600'
    },
    {
      label: 'Virtual Tours',
      value: '1,247',
      change: '+15% this week',
      icon: <TrendingUp className="w-8 h-8" />,
      color: 'text-green-600'
    },
    {
      label: 'Total Users',
      value: '156',
      change: '+8 new users',
      icon: <Users className="w-8 h-8" />,
      color: 'text-purple-600'
    },
    {
      label: 'System Health',
      value: '99.2%',
      change: 'All systems operational',
      icon: <BarChart3 className="w-8 h-8" />,
      color: 'text-orange-600'
    }
  ];

  const recentActivities = [
    {
      action: 'New location added',
      description: 'Agricultural Lab Complex was added to the campus map',
      time: '2 hours ago',
      user: 'CS Admin'
    },
    {
      action: 'Media uploaded',
      description: '360° images uploaded for Central Library',
      time: '4 hours ago',
      user: 'Library Admin'
    },
    {
      action: 'User registered',
      description: 'New department admin registered for Food Technology',
      time: '1 day ago',
      user: 'Super Admin'
    },
    {
      action: 'Location updated',
      description: 'Information updated for Student Hostel facilities',
      time: '2 days ago',
      user: 'Hostel Admin'
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your virtual campus tour system today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="card">
              <div className="flex items-center justify-between mb-4">
                <div className={stat.color}>
                  {stat.icon}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-gray-600 mb-2">
                  {stat.label}
                </div>
                <div className="text-xs text-green-600">
                  {stat.change}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  to="/admin/locations"
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="text-blue-600" size={20} />
                    <div>
                      <div className="font-medium text-gray-800">Manage Locations</div>
                      <div className="text-sm text-gray-600">Add, edit, or remove campus locations</div>
                    </div>
                  </div>
                </Link>

                <Link
                  to="/admin/users"
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Users className="text-green-600" size={20} />
                    <div>
                      <div className="font-medium text-gray-800">User Management</div>
                      <div className="text-sm text-gray-600">Manage admin accounts and permissions</div>
                    </div>
                  </div>
                </Link>

                <Link
                  to="/profile"
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Settings className="text-purple-600" size={20} />
                    <div>
                      <div className="font-medium text-gray-800">Profile Settings</div>
                      <div className="text-sm text-gray-600">Update your profile and preferences</div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Recent Activities</h2>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 mb-1">
                        {activity.action}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        {activity.description}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar size={12} />
                        <span>{activity.time}</span>
                        <span>•</span>
                        <span>by {activity.user}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;