import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  MapPin, 
  Upload, 
  Edit3, 
  Eye, 
  Calendar,
  Image,
  Video,
  Volume2,
  Plus
} from 'lucide-react';
import AdminLayout from '../../components/Admin/AdminLayout';
import { locationsAPI } from '../../services/api.js';

const DepartmentAdminDashboard = () => {
  const { user } = useAuth();
  const [assignedLocations, setAssignedLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssignedLocations = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await locationsAPI.getAllLocations();
        const all = res.data.data.locations || [];
        const assignedIds = (user?.assignedLocations || []).map(id => id?.toString());
        const assigned = all.filter(l => assignedIds.includes(l._id?.toString()));
        setAssignedLocations(assigned);
      } catch (error) {
        console.error('Error fetching assigned locations:', error);
        setError('Failed to load assigned locations');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedLocations();
  }, [user?.assignedLocations]);

  const departmentStats = [
    {
      label: 'Assigned Locations',
      value: assignedLocations.length.toString(),
      icon: <MapPin className="w-6 h-6" />,
      color: 'text-blue-600'
    },
    {
      label: 'Active Locations',
      value: assignedLocations.filter(loc => loc.isActive).length.toString(),
      icon: <Eye className="w-6 h-6" />,
      color: 'text-green-600'
    },
    {
      label: 'With Images',
      value: assignedLocations.filter(loc => loc.images && loc.images.length > 0).length.toString(),
      icon: <Calendar className="w-6 h-6" />,
      color: 'text-purple-600'
    },
    {
      label: 'With Audio',
      value: assignedLocations.filter(loc => loc.audio).length.toString(),
      icon: <Edit3 className="w-6 h-6" />,
      color: 'text-orange-600'
    }
  ];

  const getStatusColor = (isActive) => {
    return isActive ? 
      'text-green-700 bg-green-100' : 
      'text-yellow-700 bg-yellow-100';
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
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
            <MapPin size={48} className="mx-auto mb-2" />
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
            {user?.department} Department
          </h1>
          <p className="text-gray-600">
            Welcome back, {user?.name}! Manage your assigned locations and content.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {departmentStats.map((stat, index) => (
            <div key={index} className="card">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gray-100 ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-gray-600">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Assigned Locations */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Your Locations</h2>
                <button className="btn btn-primary flex items-center gap-2 text-sm">
                  <Plus size={16} />
                  Add Location
                </button>
              </div>

              {assignedLocations.length === 0 ? (
                <div className="text-center py-8">
                  <MapPin size={48} className="text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    No Locations Assigned
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Contact the Super Admin to get locations assigned to your department.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {assignedLocations.map((location) => (
                    <div key={location._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-medium text-gray-800">
                            {location.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Last updated: {location.updatedAt ? new Date(location.updatedAt).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(location.isActive)}`}>
                            {location.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {/* Media Indicators */}
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Image size={16} className={location.images && location.images.length > 0 ? 'text-green-500' : 'text-gray-300'} />
                            <Volume2 size={16} className={location.audio ? 'text-green-500' : 'text-gray-300'} />
                            <MapPin size={16} className={location.view360 ? 'text-green-500' : 'text-gray-300'} />
                            <span className="ml-2">{location.images?.length || 0} images</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            to={`/location/${location._id}`}
                            className="btn btn-outline text-xs px-3 py-2 flex items-center gap-1"
                          >
                            <Eye size={14} />
                            Preview
                          </Link>
                          <Link
                            to={`/admin/locations/edit/${location._id}`}
                            className="btn btn-primary text-xs px-3 py-2 flex items-center gap-1"
                          >
                            <Edit3 size={14} />
                            Edit
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions & Tips */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <button className="block w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <div className="flex items-center gap-3">
                    <Upload className="text-blue-600" size={20} />
                    <div>
                      <div className="text-sm font-medium text-gray-800">Upload Media</div>
                      <div className="text-xs text-gray-600">Add images, videos, or audio</div>
                    </div>
                  </div>
                </button>

                <Link
                  to="/admin/locations"
                  className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Edit3 className="text-green-600" size={20} />
                    <div>
                      <div className="text-sm font-medium text-gray-800">Update Content</div>
                      <div className="text-xs text-gray-600">Edit location information</div>
                    </div>
                  </div>
                </Link>

                <Link
                  to="/campus-map"
                  className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Eye className="text-purple-600" size={20} />
                    <div>
                      <div className="text-sm font-medium text-gray-800">Preview Tours</div>
                      <div className="text-xs text-gray-600">View public campus map</div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Content Tips */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Content Tips</h2>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-1">360° Images</h4>
                  <p className="text-blue-700">Use high-resolution panoramic images for the best virtual tour experience.</p>
                </div>
                
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-1">Audio Narration</h4>
                  <p className="text-green-700">Record clear, engaging audio guides to enhance accessibility and user experience.</p>
                </div>
                
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-medium text-purple-800 mb-1">Regular Updates</h4>
                  <p className="text-purple-700">Keep your location information current to provide accurate details to visitors.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DepartmentAdminDashboard;