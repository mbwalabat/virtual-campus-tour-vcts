import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ZoomIn, ZoomOut, RotateCcw, Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

const ViewerVideo360 = ({ videoUrl, height = 480 }) => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    setIsLoading(true);
    setHasError(false);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / height, 0.1, 1000);
    camera.position.set(0, 0, 0.1);
    
    sceneRef.current = scene;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, height);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Video element
    const video = document.createElement('video');
    video.src = videoUrl;
    video.crossOrigin = 'anonymous';
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    videoRef.current = video;
    
    video.addEventListener('loadeddata', () => {
      setIsLoading(false);
    });
    
    video.addEventListener('error', () => {
      setHasError(true);
      setIsLoading(false);
    });
    
    video.play().catch(() => {
      setIsMuted(true);
    });

    const texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBAFormat;

    const geometry = new THREE.SphereGeometry(50, 64, 64);
    geometry.scale(-1, 1, 1); // invert normals
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Enhanced orbit controls with zoom
    let isDown = false;
    let lastX = 0, lastY = 0;
    let lon = 0, lat = 0;
    let currentZoom = 1;

    const onDown = (e) => { 
      isDown = true; 
      lastX = e.clientX || e.touches?.[0]?.clientX; 
      lastY = e.clientY || e.touches?.[0]?.clientY; 
    };
    
    const onMove = (e) => {
      if (!isDown) return;
      const x = e.clientX || e.touches?.[0]?.clientX;
      const y = e.clientY || e.touches?.[0]?.clientY;
      lon += (x - lastX) * 0.1;
      lat += (y - lastY) * 0.1;
      lat = Math.max(-85, Math.min(85, lat));
      lastX = x; 
      lastY = y;
    };
    
    const onUp = () => { isDown = false; };
    
    const onWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      currentZoom *= delta;
      currentZoom = Math.max(0.5, Math.min(3, currentZoom));
      setZoomLevel(currentZoom);
    };

    renderer.domElement.addEventListener('mousedown', onDown);
    renderer.domElement.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    renderer.domElement.addEventListener('touchstart', onDown, { passive: true });
    renderer.domElement.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onUp);
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false });

    const animate = () => {
      const phi = THREE.MathUtils.degToRad(90 - lat);
      const theta = THREE.MathUtils.degToRad(lon);
      
      // Apply zoom by adjusting camera position
      const zoomFactor = 1 / currentZoom;
      camera.position.set(
        0.1 * zoomFactor,
        0,
        0.1 * zoomFactor
      );
      
      camera.target = new THREE.Vector3(
        500 * Math.sin(phi) * Math.cos(theta),
        500 * Math.cos(phi),
        500 * Math.sin(phi) * Math.sin(theta)
      );
      camera.lookAt(camera.target);
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / height;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, height);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('mousedown', onDown);
      renderer.domElement.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      renderer.domElement.removeEventListener('touchstart', onDown);
      renderer.domElement.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
      renderer.domElement.removeEventListener('wheel', onWheel);
      renderer.dispose();
      texture.dispose();
      geometry.dispose();
      material.dispose();
      video.pause();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, [videoUrl, height]);

  // Handle zoom changes
  useEffect(() => {
    if (cameraRef.current) {
      const zoomFactor = 1 / zoomLevel;
      cameraRef.current.position.set(
        0.1 * zoomFactor,
        0,
        0.1 * zoomFactor
      );
    }
  }, [zoomLevel]);

  // Control functions
  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(3, prev + 0.2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(0.5, prev - 0.2));
  };

  const handleReset = () => {
    setZoomLevel(1);
    // Reset camera position
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 0, 0.1);
    }
  };

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      } else if (containerRef.current.msRequestFullscreen) {
        containerRef.current.msRequestFullscreen();
      }
    }
  };

  return (
    <div className="relative w-full bg-black rounded-xl overflow-hidden" style={{ height }}>
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-20">
          <div className="text-center text-white">
            <div className="w-12 h-12 mx-auto mb-4 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <p className="text-lg font-medium">Loading 360° Video...</p>
            <p className="text-sm text-gray-300 mt-2">Please wait while the video loads</p>
          </div>
        </div>
      )}

      {/* Error overlay */}
      {hasError && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-20">
          <div className="text-center text-white">
            <div className="w-12 h-12 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">!</span>
            </div>
            <p className="text-lg font-medium">Failed to Load Video</p>
            <p className="text-sm text-gray-300 mt-2">Please check your internet connection</p>
          </div>
        </div>
      )}

      {/* Video container */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Control overlay */}
      {!isLoading && !hasError && (
        <div className="absolute bottom-4 left-4 right-4 z-10">
          {/* Main controls */}
          <div className="flex items-center justify-between bg-black bg-opacity-50 backdrop-blur-sm rounded-lg p-3 mb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePlayPause}
                className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-all duration-200"
              >
                {isPlaying ? <Pause size={20} className="text-white" /> : <Play size={20} className="text-white" />}
              </button>
              
              <button
                onClick={handleMuteToggle}
                className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-all duration-200"
              >
                {isMuted ? <VolumeX size={20} className="text-white" /> : <Volume2 size={20} className="text-white" />}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleZoomOut}
                className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-all duration-200"
              >
                <ZoomOut size={20} className="text-white" />
              </button>
              
              <span className="text-white text-sm font-medium px-2">
                {Math.round(zoomLevel * 100)}%
              </span>
              
              <button
                onClick={handleZoomIn}
                className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-all duration-200"
              >
                <ZoomIn size={20} className="text-white" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-all duration-200"
                title="Reset View"
              >
                <RotateCcw size={20} className="text-white" />
              </button>
              
              <button
                onClick={handleFullscreen}
                className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-all duration-200"
                title="Fullscreen"
              >
                <Maximize size={20} className="text-white" />
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-lg p-3">
            <div className="text-white text-sm text-center">
              <p className="font-medium mb-1">360° Video Controls</p>
              <div className="flex items-center justify-center gap-4 text-xs text-gray-300">
                <span>🖱️ Drag to look around</span>
                <span>🔍 Scroll to zoom</span>
                <span>▶️ Click play/pause</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewerVideo360;
