import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react';

const AudioPlayer = ({ audioUrl, title = 'Audio Guide' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setError(false);
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, [audioUrl]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setLoading(true);
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setLoading(false);
      }).catch(() => {
        setLoading(false);
        setError(true);
      });
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const handleSeek = (e) => {
    if (!audioRef.current) return;
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const skipBackward = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
  };

  const skipForward = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="audio-player">
      {/* Main Controls */}
      <div className="flex items-center gap-4">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          disabled={loading || error}
          className="audio-button"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause size={20} />
          ) : (
            <Play size={20} />
          )}
        </button>

        {/* Skip Controls */}
        <div className="flex gap-2">
          <button
            onClick={skipBackward}
            className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
            title="Skip backward 10s"
            disabled={loading || error}
          >
            <SkipBack size={14} />
          </button>
          <button
            onClick={skipForward}
            className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
            title="Skip forward 10s"
            disabled={loading || error}
          >
            <SkipForward size={14} />
          </button>
        </div>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-800 text-sm truncate">{title}</h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-500">{formatTime(currentTime)}</span>
            <div className="flex-1 h-1 bg-gray-300 rounded-full overflow-hidden cursor-pointer" onClick={handleSeek}>
              <div 
                className="h-full bg-green-600 transition-all duration-300"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-500">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
            disabled={loading || error}
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={e => setVolume(Number(e.target.value))}
            className="w-16 h-1 bg-gray-300 rounded-full overflow-hidden"
            disabled={loading || error}
          />
        </div>
      </div>

      {/* Audio Element (Hidden) */}
      <audio
        ref={audioRef}
        preload="metadata"
        src={audioUrl}
        onLoadedMetadata={e => setDuration(e.target.duration || 0)}
        onTimeUpdate={e => setCurrentTime(e.target.currentTime || 0)}
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => { setError(true); setLoading(false); }}
        onWaiting={() => setLoading(true)}
        onCanPlay={() => setLoading(false)}
      />
      {error && (
        <div className="text-red-600 text-xs mt-2">Failed to load audio.</div>
      )}
    </div>
  );
};

export default AudioPlayer;