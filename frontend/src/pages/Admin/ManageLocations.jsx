import { useState, useEffect, useContext } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Filter,
  MapPin,
  Eye,
  Upload,
  Image,
  Video,
  Volume2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/Admin/AdminLayout';
import LocationModal from '../../components/Admin/LocationModal';
import { locationsAPI } from '../../services/api.js';
import { useAuth } from '../../contexts/AuthContext';

const ManageLocations = () => {
  const { user } = useAuth(); // <-- get current user
  const [locations, setLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'academic', label: 'Academic' },
    { id: 'administration', label: 'Administration' },
    { id: 'research', label: 'Research' },
    { id: 'accommodation', label: 'Accommodation' },
    { id: 'dining', label: 'Dining' },
    { id: 'recreation', label: 'Recreation' }
  ];

  // Fetch locations from API
  const fetchLocations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await locationsAPI.getAllLocations();
      setLocations(response.data.data.locations);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setError('Failed to load locations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const filteredLocations = locations.filter(location => {
    if (user?.role === 'departmentAdmin') {
      const assigned = (user.assignedLocations || []).map(id => id?.toString());
      return assigned.includes(location._id?.toString());
    }
    const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || location.department.toLowerCase().includes(filterCategory.toLowerCase());
    const matchesStatus = filterStatus === 'all' || (filterStatus === 'published' ? location.isActive : !location.isActive);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleAddLocation = () => {
    setEditingLocation(null);
    setShowLocationModal(true);
  };

  const handleEditLocation = (location) => {
    setEditingLocation(location);
    setShowLocationModal(true);
  };

  const handleDeleteLocation = async (locationId) => {
    if (window.confirm('Are you sure you want to delete this location? This action cannot be undone.')) {
      try {
        await locationsAPI.deleteLocation(locationId);
        fetchLocations(); // Refresh the list
      } catch (error) {
        console.error('Error deleting location:', error);
        alert('Failed to delete location. Please try again.');
      }
    }
  };

  const handleSaveLocation = async (formData) => {
  try {
    // Create location data with URLs from Cloudinary upload
    const locationData = {
      name: formData.name,
      description: formData.description,
      department: formData.department,
      category: formData.category,
      coordinates: {
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude)
      },
      // Include media URLs from Cloudinary upload
      imageUrls: formData.imageUrls || [],
      audioUrl: formData.audioUrl || null,
      videoUrl: formData.videoUrl || null,
      view360Url: formData.view360Url || null
    };

    console.log('Sending location data to backend:', locationData);

    let location;
    if (editingLocation) {
      // Update existing location
      const response = await locationsAPI.updateLocation(editingLocation._id, locationData);
      location = response.data.data;
    } else {
      // Create new location
      const response = await locationsAPI.createLocation(locationData);
      location = response.data.data;
    }

    fetchLocations();
    setShowLocationModal(false);
    setEditingLocation(null);
  } catch (error) {
    console.error("Error saving location:", error);
    throw error;
  }
};



  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'text-green-700 bg-green-100';
      case 'draft':
        return 'text-yellow-700 bg-yellow-100';
      case 'review':
        return 'text-blue-700 bg-blue-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const getCategoryColor = (department) => {
    const colors = {
      'computer science': 'text-blue-600 bg-blue-100',
      'library': 'text-purple-600 bg-purple-100',
      'administration': 'text-green-600 bg-green-100',
      'engineering': 'text-yellow-600 bg-yellow-100',
      'business': 'text-orange-600 bg-orange-100',
      'agriculture': 'text-red-600 bg-red-100'
    };
    return colors[department.toLowerCase()] || 'text-gray-600 bg-gray-100';
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-600">Loading locations...</p>
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
            <h3 className="text-lg font-semibold">Error Loading Locations</h3>
            <p className="text-sm">{error}</p>
          </div>
          <button 
            onClick={fetchLocations}
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
            <h1 className="text-3xl font-bold text-gray-800">Location Management</h1>
            <p className="text-gray-600 mt-1">Manage campus locations and virtual tour content</p>
          </div>
          {user?.role === 'superAdmin' && (
            <button 
              onClick={handleAddLocation}
              className="btn btn-primary flex items-center gap-2"
            >
              <Plus size={20} />
              Add Location
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="card">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search locations by name, description, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.label}</option>
                ))}
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
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="review">Under Review</option>
              </select>
              <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>
        </div>

        {/* Locations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredLocations.map((location) => (
            <div key={location._id} className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getCategoryColor(location.department)}`}>
                    {location.department}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(location.isActive ? 'published' : 'draft')}`}>
                    {location.isActive ? 'Published' : 'Draft'}
                  </span>
                </div>
                <MapPin className="text-gray-400" size={20} />
              </div>

              <h3 className="text-lg font-semibold text-gray-800 mb-2">{location.name}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{location.description}</p>
              
              <div className="mb-4 text-sm text-gray-500">
                <div>Department: {location.department}</div>
                <div>Created: {new Date(location.createdAt).toLocaleDateString()}</div>
                <div>Coordinates: {
                  location.coordinates?.latitude != null && !isNaN(location.coordinates.latitude)
                    ? location.coordinates.latitude.toFixed(4)
                    : '-'
                }, {
                  location.coordinates?.longitude != null && !isNaN(location.coordinates.longitude)
                    ? location.coordinates.longitude.toFixed(4)
                    : '-'
                }
                </div>
              </div>

              {/* Media Indicators */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  <Image size={16} className={location.images && location.images.length > 0 ? 'text-green-500' : 'text-gray-300'} />
                  <span className="text-xs text-gray-600">Images ({location.images?.length || 0})</span>
                </div>
                <div className="flex items-center gap-1">
                  <Volume2 size={16} className={location.audio ? 'text-green-500' : 'text-gray-300'} />
                  <span className="text-xs text-gray-600">Audio</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={16} className={location.view360 ? 'text-green-500' : 'text-gray-300'} />
                  <span className="text-xs text-gray-600">360° View</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Link
                  to={`/location/${location._id}`}
                  className="btn btn-outline text-xs px-3 py-2 flex items-center gap-1 flex-1"
                >
                  <Eye size={14} />
                  Preview
                </Link>
                <button
                  onClick={() => handleEditLocation(location)}
                  className="btn btn-primary text-xs px-3 py-2 flex items-center gap-1 flex-1"
                >
                  <Edit3 size={14} />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteLocation(location._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Location"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredLocations.length === 0 && (
          <div className="text-center py-12">
            <MapPin size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Locations Found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card text-center">
            <div className="text-2xl font-bold text-gray-800 mb-1">
              {locations.length}
            </div>
            <div className="text-sm text-gray-600">Total Locations</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {locations.filter(l => l.status === 'published').length}
            </div>
            <div className="text-sm text-gray-600">Published</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-yellow-600 mb-1">
              {locations.filter(l => l.status === 'draft').length}
            </div>
            <div className="text-sm text-gray-600">Drafts</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {locations.reduce((sum, loc) => sum + loc.tourCount, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Tours</div>
          </div>
        </div>
      </div>

      {/* Location Modal */}
      {showLocationModal && (
        <LocationModal
          location={editingLocation}
          onSave={handleSaveLocation}
          onClose={() => {
            setShowLocationModal(false);
            setEditingLocation(null);
          }}
        />
      )}
    </AdminLayout>
  );
};

export default ManageLocations;