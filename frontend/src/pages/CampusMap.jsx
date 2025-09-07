import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MapPin, X, Play } from 'lucide-react';
import LocationPopup from '../components/Campus/LocationPopup.jsx';
import { locationsAPI } from '../services/api.js';

const CampusMap = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Compute bounds for lat/lng to map to 0-100%
  const bounds = useMemo(() => {
    const lats = locations
      .map(l => l?.coordinates?.latitude)
      .filter(v => typeof v === 'number' && !isNaN(v));
    const lngs = locations
      .map(l => l?.coordinates?.longitude)
      .filter(v => typeof v === 'number' && !isNaN(v));
    if (lats.length === 0 || lngs.length === 0) return null;
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    return { minLat, maxLat, minLng, maxLng };
  }, [locations]);

  const projectToPercent = (lat, lng) => {
    if (!bounds) return { left: '50%', top: '50%' };
    const { minLat, maxLat, minLng, maxLng } = bounds;
    const dx = maxLng - minLng || 1;
    const dy = maxLat - minLat || 1;
    const x = ((lng - minLng) / dx) * 100; // 0 -> 100
    const y = ((maxLat - lat) / dy) * 100; // invert y so north is up
    return { left: `${Math.min(100, Math.max(0, x))}%`, top: `${Math.min(100, Math.max(0, y))}%` };
  };

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const response = await locationsAPI.getAllLocations();
        setLocations(response.data.data.locations);
      } catch (err) {
        console.error('Error fetching locations:', err);
        setError('Failed to load locations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  const categories = [
    { id: 'all', label: 'All Locations', color: 'bg-gray-600' },
    { id: 'academic', label: 'Academic', color: 'bg-blue-600' },
    { id: 'administration', label: 'Administration', color: 'bg-purple-600' },
    { id: 'research', label: 'Research', color: 'bg-green-600' },
    { id: 'accommodation', label: 'Accommodation', color: 'bg-yellow-600' },
    { id: 'dining', label: 'Dining', color: 'bg-orange-600' },
    { id: 'recreation', label: 'Recreation', color: 'bg-red-600' },
    { id: 'events', label: 'Events', color: 'bg-indigo-600' }
  ];

  const filteredLocations = locations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || location.department.toLowerCase().includes(selectedCategory.toLowerCase()); // Assuming department maps to category
    return matchesSearch && matchesCategory;
  });

  const handleMarkerClick = (location) => {
    setSelectedLocation(location);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedLocation(null);
  };

  const getCategoryColor = (department) => {
    // Simple mapping for demonstration, you might need a more robust one
    if (department.toLowerCase().includes('computer science')) return 'bg-blue-600';
    if (department.toLowerCase().includes('library')) return 'bg-purple-600';
    if (department.toLowerCase().includes('administration')) return 'bg-green-600';
    return 'bg-gray-600';
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-600">Loading locations...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container py-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Interactive Campus Map
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore Sindh Agriculture University campus by clicking on the markers below. 
              Each location offers a detailed 360° virtual tour experience.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
              <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="container py-8">
        <div className="relative">
          {/* Map Background */}
          <div className="map-container relative bg-gradient-to-br from-green-100 to-green-200">
            {/* Campus Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-40"
              style={{
                backgroundImage: 'url("https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=1200")'
              }}
            ></div>
            
            {/* Campus Layout Overlay */}
            <div className="absolute inset-0">
              {/* Campus paths and roads */}
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path
                  d="M 10 50 Q 30 30 50 50 T 90 50"
                  stroke="#6b7280"
                  strokeWidth="0.5"
                  fill="none"
                  opacity="0.6"
                />
                <path
                  d="M 50 10 L 50 90"
                  stroke="#6b7280"
                  strokeWidth="0.3"
                  opacity="0.6"
                />
              </svg>
            </div>

            {/* Location Markers */}
            {filteredLocations.map((location) => {
              const lat = location?.coordinates?.latitude;
              const lng = location?.coordinates?.longitude;
              if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
                return null;
              }
              const pos = projectToPercent(lat, lng);
              return (
                <div
                  key={location._id}
                  className="absolute -translate-x-1/2 -translate-y-full cursor-pointer"
                  style={pos}
                  onClick={() => handleMarkerClick(location)}
                  title={location.name}
                >
                  <div className={`map-marker ${getCategoryColor(location.department)} flex items-center gap-1 px-2 py-1 rounded-full shadow text-white text-xs`}> 
                    <MapPin size={14} className="text-white" />
                    <span className="whitespace-nowrap">{location.name}</span>
                  </div>
                </div>
              );
            })}

            {/* Map Legend */}
            <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
              <h3 className="font-semibold text-gray-800 mb-3">Location Categories</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {categories.filter(cat => cat.id !== 'all').map(category => (
                  <div key={category.id} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getCategoryColor(category.label)}`}></div>
                    <span className="text-gray-600">{category.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg text-sm">
              Click on markers to explore locations
            </div>
          </div>
        </div>

        {/* Location Grid */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">All Locations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredLocations.map((location) => (
   <div key={location._id} className="card overflow-hidden">
  <img
    src={
      location.images && location.images.length > 0
        ? `http://localhost:5000${location.images[0]}`
        : '/no-image.png'
    }
    alt={location.name}
    className="w-full h-48 object-cover"
  />
  <div className="p-4">
    <div className="flex items-center gap-2 mb-2">
      <div className={`w-3 h-3 rounded-full ${getCategoryColor(location.department)}`}></div>
      <span className="text-sm text-gray-500 capitalize">{location.department}</span>
    </div>
    <h3 className="text-lg font-semibold text-gray-800 mb-2">{location.name}</h3>
    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{location.description}</p>
    <Link
      to={`/location/${location._id}`}
      className="btn btn-primary w-full flex items-center justify-center gap-2"
    >
      <Play size={16} />
      Explore Location
    </Link>
  </div>
</div>

            ))}
          </div>

          {filteredLocations.length === 0 && (
            <div className="text-center py-12">
              <MapPin size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No locations found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Location Popup */}
      {showPopup && selectedLocation && (
        <LocationPopup
          location={selectedLocation}
          onClose={closePopup}
        />
      )}
    </div>
  );
};

export default CampusMap;


