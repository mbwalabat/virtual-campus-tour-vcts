import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, Info, Image as ImageIcon } from 'lucide-react';
import Viewer360 from '../components/Campus/Viewer360';
import AudioPlayer from '../components/Campus/AudioPlayer';
import ViewerVideo360 from '../components/Campus/ViewerVideo360.jsx';
import { locationsAPI,API_BASE_URL } from '../services/api.js';

const LocationDetails = () => {
  const { id } = useParams();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const fetchLocationDetails = async () => {
      try {
        setLoading(true);
        const response = await locationsAPI.getLocationById(id);
        console.log('Location data received:', response.data.data);
        console.log('Images array:', response.data.data.images);
        setLocation(response.data.data);
      } catch (err) {
        console.error('Error fetching location details:', err);
        setError('Failed to load location details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchLocationDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading location details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/campus-map" className="btn btn-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Campus Map
          </Link>
        </div>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Location Not Found</h2>
          <p className="text-gray-600 mb-6">The requested location could not be found.</p>
          <Link to="/campus-map" className="btn btn-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Campus Map
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Link 
              to="/campus-map" 
              className="btn btn-outline flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to Map
            </Link>
            
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="btn btn-secondary flex items-center gap-2"
            >
              <Info size={16} />
              {showInfo ? 'Hide Info' : 'Show Info'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 360 Viewer */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  360° Interactive View
                </h2>
                <p className="text-gray-600 text-sm mt-1">Explore this location in immersive detail</p>
              </div>
              <div className="h-[600px]">
                {console.log('360° view data:', {video: location.video, view360: location.view360})}
                {location.video && (
                  <div className="relative mb-8">
                    <ViewerVideo360 videoUrl={location.video} height={600} />
                    <div className="absolute top-4 left-4 bg-black bg-opacity-50 backdrop-blur-sm rounded-lg px-3 py-2">
                      <p className="text-white text-sm font-medium">🎥 360° Video Experience</p>
                    </div>
                  </div>
                )}
                {location.view360 && (
                  <div className="relative">
                    <div className="absolute top-4 left-4 bg-black bg-opacity-50 backdrop-blur-sm rounded-lg px-3 py-2 z-10">
                      <p className="text-white text-sm font-medium">🖼️ 360° Panorama View</p>
                    </div>
                    <Viewer360
                      imageUrl={location.view360.startsWith('http') ? location.view360 : `${API_BASE_URL}${location.view360}`}
                      hotspots={[]}
                    />
                  </div>
                )}
                {!location.video && !location.view360 && (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <div className="w-20 h-20 mx-auto mb-4 bg-gray-300 rounded-full flex items-center justify-center">
                        <Maximize size={32} />
                      </div>
                      <h3 className="text-xl font-medium mb-2">No 360° View Available</h3>
                      <p className="text-sm">This location doesn't have a panoramic view yet.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Information Panel */}
          <div className="space-y-6">
            {/* Location Info */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-4 h-4 rounded-full ${location.department === 'Computer Science' ? 'bg-blue-500' : location.department === 'Library' ? 'bg-purple-500' : 'bg-green-500'}`}></div>
                  <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">{location.department}</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-3">{location.name}</h1>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>📍 {location.coordinates?.latitude?.toFixed(4)}, {location.coordinates?.longitude?.toFixed(4)}</span>
                </div>
              </div>
              
              <div className="prose prose-gray max-w-none mb-6">
                <p className="text-gray-700 leading-relaxed text-base">{location.description}</p>
              </div>

              {/* Audio Narration */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Volume2 size={18} />
                  Audio Narration
                </h3>
                {location.audio ? (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <AudioPlayer 
                      audioUrl={location.audio.startsWith('http') ? location.audio : `${API_BASE_URL}${location.audio}`}
                      title={`${location.name} Audio Guide`}
                    />
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <div className="w-12 h-12 mx-auto mb-3 bg-gray-200 rounded-full flex items-center justify-center">
                      <Volume2 size={20} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm">No audio narration available for this location.</p>
                  </div>
                )}
              </div>

              {showInfo && (
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Detailed Information</h3>
                  <div className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-600 capitalize mb-1">Created By:</dt>
                      <dd className="text-gray-800 text-sm">{location.createdBy?.name || 'N/A'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600 capitalize mb-1">Department:</dt>
                      <dd className="text-gray-800 text-sm">{location.department}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600 capitalize mb-1">Coordinates:</dt>
                      <dd className="text-gray-800 text-sm">Lat: {location.coordinates?.latitude}, Lng: {location.coordinates?.longitude}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600 capitalize mb-1">Active:</dt>
                      <dd className="text-gray-800 text-sm">{location.isActive ? 'Yes' : 'No'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600 capitalize mb-1">Created At:</dt>
                      <dd className="text-gray-800 text-sm">{new Date(location.createdAt).toLocaleDateString()}</dd>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Videos (if any) */}
            {location.videos && location.videos.length > 0 && (
              <div className="card">
                <h3 className="font-semibold text-gray-800 mb-4">Related Videos</h3>
                <div className="space-y-4">
                  {location.videos.map((video, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                      <video
                        controls
                        className="w-full h-48 bg-black"
                        poster={location.images && location.images.length > 0 ? (location.images[0].startsWith('http') ? location.images[0] : `${API_BASE_URL}${location.images[0]}`) : ''}
                      >
                        <source src={video.url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      <div className="p-3">
                        <h4 className="font-medium text-gray-800">{video.title}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}


            {/* Additional Images */}
            {location.images && location.images.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <ImageIcon size={18} />
                  Photo Gallery
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {location.images.map((image, index) => (
                    <div key={index} className="relative overflow-hidden rounded-xl bg-white border border-gray-200">
                      {/* Loading placeholder */}
                      <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-500 text-sm z-10" id={`loading-${index}`}>
                        <div className="text-center">
                          <div className="w-8 h-8 mx-auto mb-2 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                          <p>Loading...</p>
                        </div>
                      </div>
                      
                      <img
                        src={image.startsWith('http') ? image : `${API_BASE_URL}${image}`}
                        alt={`${location.name} - Gallery ${index + 1}`}
                        className="w-full h-32 object-cover transition-transform duration-300 hover:scale-105"
                        loading="lazy"
                        style={{
                          display: 'block',
                          width: '100%',
                          height: '128px',
                          objectFit: 'cover',
                          backgroundColor: 'transparent'
                        }}
                        onError={(e) => {
                          console.error('Image failed to load:', image);
                          e.target.style.display = 'none';
                          document.getElementById(`loading-${index}`).style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                        onLoad={(e) => {
                          console.log('Image loaded successfully:', image);
                          document.getElementById(`loading-${index}`).style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-500 text-sm" style={{display: 'none'}}>
                        <div className="text-center">
                          <div className="w-8 h-8 mx-auto mb-2 bg-gray-300 rounded-full flex items-center justify-center">
                            <ImageIcon size={16} />
                          </div>
                          <p>Image not available</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationDetails;


