import { useState, useRef, useEffect } from 'react';
import { RotateCcw, Maximize, ZoomIn, ZoomOut, Info, Download, Share2 } from 'lucide-react';

const Viewer360 = ({ imageUrl, hotspots = [] }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const viewerRef = useRef(null);
  const imageRef = useRef(null);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - lastMouse.x;
    const deltaY = e.clientY - lastMouse.y;

    setRotation(prev => ({
      x: Math.max(-90, Math.min(90, prev.x - deltaY * 0.5)),
      y: prev.y + deltaX * 0.5
    }));

    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  const resetView = () => {
    setRotation({ x: 0, y: 0 });
    setZoom(1);
  };

  const zoomIn = () => {
    setZoom(prev => Math.min(3, prev + 0.2));
  };

  const zoomOut = () => {
    setZoom(prev => Math.max(0.5, prev - 0.2));
  };

  const toggleFullscreen = () => {
    if (viewerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        viewerRef.current.requestFullscreen();
      }
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setImageError(true);
  };

  useEffect(() => {
    const viewer = viewerRef.current;
    if (viewer) {
      viewer.addEventListener('mousemove', handleMouseMove);
      viewer.addEventListener('mouseup', handleMouseUp);
      viewer.addEventListener('mouseleave', handleMouseUp);
      viewer.addEventListener('wheel', handleWheel, { passive: false });

      return () => {
        viewer.removeEventListener('mousemove', handleMouseMove);
        viewer.removeEventListener('mouseup', handleMouseUp);
        viewer.removeEventListener('mouseleave', handleMouseUp);
        viewer.removeEventListener('wheel', handleWheel);
      };
    }
  }, [isDragging, lastMouse]);

  if (imageError) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-xl flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <Info size={24} />
          </div>
          <h3 className="text-lg font-medium mb-2">Image Not Available</h3>
          <p className="text-sm">The 360° panorama image could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-gray-900 rounded-xl overflow-hidden shadow-2xl" ref={viewerRef}>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-20">
          <div className="text-center text-white">
            <div className="w-12 h-12 mx-auto mb-4 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <p className="text-lg font-medium">Loading 360° View...</p>
            <p className="text-sm text-gray-300 mt-2">Please wait while the panorama loads</p>
          </div>
        </div>
      )}

      {/* 360 Image */}
      <div
        className="w-full h-full overflow-hidden cursor-grab active:cursor-grabbing relative"
        onMouseDown={handleMouseDown}
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'center center'
        }}
      >
        <img
          ref={imageRef}
          src={imageUrl}
          alt="360° Panorama View"
          className="w-full h-full object-cover transition-transform duration-100"
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transformStyle: 'preserve-3d'
          }}
          draggable={false}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />

        {/* Hotspots */}
        {hotspots.map((hotspot, index) => (
          <div
            key={index}
            className="absolute w-8 h-8 bg-yellow-400 border-3 border-white rounded-full cursor-pointer hover:scale-110 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
            style={{
              left: `${hotspot.x}%`,
              top: `${hotspot.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            onClick={() => setSelectedHotspot(hotspot)}
          >
            <Info size={14} className="text-white" />
          </div>
        ))}
      </div>

      {/* Professional Controls */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex items-center gap-3 bg-black bg-opacity-80 backdrop-blur-sm rounded-full px-4 py-3 shadow-lg">
          <button
            className="flex items-center justify-center w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full transition-all duration-200 hover:scale-110"
            onClick={zoomOut}
            title="Zoom Out"
          >
            <ZoomOut size={18} />
          </button>
          
          <div className="flex items-center gap-2 bg-white bg-opacity-10 rounded-full px-3 py-1">
            <span className="text-white text-sm font-medium">{Math.round(zoom * 100)}%</span>
          </div>
          
          <button
            className="flex items-center justify-center w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full transition-all duration-200 hover:scale-110"
            onClick={zoomIn}
            title="Zoom In"
          >
            <ZoomIn size={18} />
          </button>
          
          <div className="w-px h-6 bg-white bg-opacity-30"></div>
          
          <button
            className="flex items-center justify-center w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full transition-all duration-200 hover:scale-110"
            onClick={resetView}
            title="Reset View"
          >
            <RotateCcw size={18} />
          </button>
          
          <button
            className="flex items-center justify-center w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full transition-all duration-200 hover:scale-110"
            onClick={toggleFullscreen}
            title="Fullscreen"
          >
            <Maximize size={18} />
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute top-6 left-6 bg-black bg-opacity-70 backdrop-blur-sm text-white px-4 py-3 rounded-xl text-sm shadow-lg">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="font-medium">Interactive 360° View</span>
        </div>
        <p className="text-gray-300">Drag to rotate • Scroll to zoom • Click hotspots for info</p>
      </div>

      {/* Hotspot Info Popup */}
      {selectedHotspot && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-6 max-w-sm z-30 border border-gray-200">
          <div className="flex items-start justify-between mb-3">
            <h4 className="font-semibold text-gray-800 text-lg">{selectedHotspot.title}</h4>
            <button
              onClick={() => setSelectedHotspot(null)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Info size={20} />
            </button>
          </div>
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">{selectedHotspot.description}</p>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedHotspot(null)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Close
            </button>
            {selectedHotspot.action && (
              <button
                onClick={selectedHotspot.action}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Learn More
              </button>
            )}
          </div>
        </div>
      )}

      {/* Zoom Level Indicator */}
      <div className="absolute top-6 right-6 bg-black bg-opacity-70 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg">
        {Math.round(zoom * 100)}% Zoom
      </div>
    </div>
  );
};

export default Viewer360;