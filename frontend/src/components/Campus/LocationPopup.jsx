import { Link } from 'react-router-dom';
import { X, Play, MapPin, ArrowRight } from 'lucide-react';

const LocationPopup = ({ location, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-90vh overflow-y-auto">
        {/* Header */}
        <div className="relative">
          <img
            src={
              location.images && location.images.length > 0
                ? `http://localhost:5000${location.images[0]}`
                : '/no-image.png'
            }
            alt={location.name}
            className="w-full h-48 object-cover rounded-t-lg"
          />

          <button
            onClick={onClose}
            className="absolute top-2 right-2 w-8 h-8 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors"
          >
            <X size={16} />
          </button>
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
            <MapPin size={12} className="inline mr-1" />
            {location.department}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">{location.name}</h2>
          <p className="text-gray-600 mb-4 leading-relaxed">{location.description}</p>

          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">What you'll see:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 360° interactive view</li>
              <li>• Detailed information panels</li>
              <li>• Audio narration</li>
              <li>• High-quality images and videos</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to={`/location/${location._id}`}
              className="btn btn-primary flex items-center justify-center gap-2 flex-1"
              onClick={onClose}
            >
              <Play size={16} />
              Start Exploring
            </Link>

            <button
              onClick={onClose}
              className="btn btn-outline flex items-center justify-center gap-2"
            >
              <ArrowRight size={16} />
              Continue Browsing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationPopup;
