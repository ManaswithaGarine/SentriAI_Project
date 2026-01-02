import React, { useEffect, useRef, useState } from 'react';
import { Camera, AlertTriangle, Maximize2, Minimize2, WifiOff, RefreshCw } from 'lucide-react';
import webSocketService from '../services/websocket';

const VideoFeed = ({ cameraId, name, streamUrl, onMaximize }) => {
  const videoRef = useRef(null);
  const [isOnline, setIsOnline] = useState(true);
  const [crowdDensity, setCrowdDensity] = useState(0);
  const [hasAlert, setHasAlert] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [peopleCount, setPeopleCount] = useState(0);
  const mediaSourceRef = useRef(null);
  const sourceBufferRef = useRef(null);

  useEffect(() => {
    // Setup WebSocket listeners for analytics data
    const unsubscribeCrowd = webSocketService.onCrowdUpdate((data) => {
      if (data.cameraId === cameraId) {
        setCrowdDensity(data.density);
        setPeopleCount(data.peopleCount || 0);
        setHasAlert(data.density > 80);
      }
    });

    const unsubscribeStatus = webSocketService.onCameraStatus((data) => {
      if (data.cameraId === cameraId) {
        setIsOnline(data.status === 'online');
      }
    });

    // Handle video stream from WebSocket
    const unsubscribeVideo = webSocketService.onVideoFrame((data) => {
      if (data.cameraId === cameraId && data.frame) {
        handleVideoFrame(data.frame);
      }
    });

    // Request camera feed
    webSocketService.requestCameraFeed(cameraId);

    return () => {
      unsubscribeCrowd();
      unsubscribeStatus();
      unsubscribeVideo();
      cleanupMediaSource();
    };
  }, [cameraId]);

  // Handle different video streaming methods
  useEffect(() => {
    if (!streamUrl || !videoRef.current) return;

    setIsLoading(true);
    setError(null);

    const video = videoRef.current;

    // Method 1: Direct video URL (MJPEG, HLS, etc.)
    if (streamUrl.endsWith('.m3u8')) {
      // HLS Stream
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        const hls = new window.Hls();
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(err => setError('Playback failed'));
        });
        hls.on(window.Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            setError('Stream error');
            setIsOnline(false);
          }
        });
      }
    } else if (streamUrl.startsWith('ws://') || streamUrl.startsWith('wss://')) {
      // WebSocket stream - handled by onVideoFrame listener
      console.log('WebSocket stream initialized for', cameraId);
    } else {
      // Regular video stream (MJPEG, MP4, etc.)
      video.src = streamUrl;
    }

    video.onloadeddata = () => {
      setIsLoading(false);
      setIsOnline(true);
    };

    video.onerror = () => {
      setError('Failed to load video');
      setIsLoading(false);
      setIsOnline(false);
    };

    return () => {
      video.src = '';
    };
  }, [streamUrl, cameraId]);

  const handleVideoFrame = (frameData) => {
    // Handle video frames from WebSocket
    // This could be base64 encoded images or binary data
    if (!videoRef.current) return;

    try {
      if (typeof frameData === 'string' && frameData.startsWith('data:image')) {
        // If receiving MJPEG frames as base64
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          setIsLoading(false);
          setIsOnline(true);
        };
        img.onerror = () => {
          setError('Frame decode error');
        };
        img.src = frameData;
      } else if (frameData instanceof Blob) {
        // If receiving binary video data
        const url = URL.createObjectURL(frameData);
        videoRef.current.src = url;
        setIsLoading(false);
        setIsOnline(true);
      }
    } catch (err) {
      console.error('Error handling video frame:', err);
      setError('Frame processing error');
    }
  };

  const cleanupMediaSource = () => {
    if (mediaSourceRef.current) {
      try {
        if (mediaSourceRef.current.readyState === 'open') {
          mediaSourceRef.current.endOfStream();
        }
      } catch (e) {
        console.error('Error cleaning up MediaSource:', e);
      }
      mediaSourceRef.current = null;
    }
    sourceBufferRef.current = null;
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    if (onMaximize) {
      onMaximize(!isMaximized);
    }
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    webSocketService.requestCameraFeed(cameraId);
  };

  const getStatusColor = () => {
    if (!isOnline) return 'bg-gray-500';
    if (hasAlert) return 'bg-red-500 animate-pulse';
    if (crowdDensity > 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getDensityColor = () => {
    if (hasAlert) return '#ef4444'; // red
    if (crowdDensity > 60) return '#f59e0b'; // orange
    return '#10b981'; // green
  };

  return (
    <div 
      className={`relative rounded-lg overflow-hidden shadow-lg border-2 transition-all ${
        isMaximized ? 'fixed inset-4 z-50' : 'h-64'
      } ${hasAlert ? 'border-red-500 animate-pulse' : 'border-gray-700'}`}
    >
      {/* Video Stream */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover bg-gray-900"
        autoPlay
        muted
        playsInline
      />

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-3" />
            <p className="text-white text-sm">Connecting to camera...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <WifiOff className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <p className="text-white text-sm mb-3">{error}</p>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold"
            >
              Retry Connection
            </button>
          </div>
        </div>
      )}

      {/* Offline Placeholder */}
      {!isOnline && !isLoading && !error && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <Camera className="w-16 h-16 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Camera Offline</p>
          </div>
        </div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 pointer-events-none">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-3 flex justify-between items-center pointer-events-auto">
          <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-lg">
            <Camera className="text-white w-5 h-5" />
            <span className="text-white font-semibold text-sm">{name}</span>
            <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
          </div>
          
          <button
            onClick={handleMaximize}
            className="bg-black/50 backdrop-blur-sm p-2 rounded-lg text-white hover:bg-black/70 transition-colors"
            title={isMaximized ? "Exit fullscreen" : "Fullscreen"}
          >
            {isMaximized ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>
        </div>

        {/* Recording Indicator */}
        {isOnline && (
          <div className="absolute top-3 right-3 flex items-center gap-2 bg-red-600 px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-white text-xs font-bold">REC</span>
          </div>
        )}

        {/* Bottom Info Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-3 pointer-events-auto">
          <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3">
            {/* People Count */}
            {peopleCount > 0 && (
              <div className="text-white text-sm mb-2 flex items-center gap-2">
                <span className="font-semibold">{peopleCount}</span>
                <span className="text-gray-300">people detected</span>
              </div>
            )}

            {/* Crowd Density */}
            <div className="flex justify-between items-center text-white text-sm mb-2">
              <span className="font-semibold">Crowd Density</span>
              <span className={`font-bold ${hasAlert ? 'text-red-400' : 'text-white'}`}>
                {crowdDensity}%
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="bg-gray-700/50 rounded-full h-2 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${crowdDensity}%`,
                  backgroundColor: getDensityColor()
                }}
              />
            </div>

            {/* Alert Text */}
            {hasAlert && (
              <div className="mt-2 text-red-400 text-xs font-semibold flex items-center gap-1">
                <AlertTriangle size={14} />
                HIGH DENSITY ALERT
              </div>
            )}
          </div>
        </div>

        {/* Center Alert Icon */}
        {hasAlert && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="animate-pulse">
              <div className="bg-red-500/20 backdrop-blur-sm rounded-full p-6">
                <AlertTriangle className="text-red-500 w-16 h-16" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Camera ID Badge */}
      <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-white text-xs font-mono">
        {cameraId}
      </div>
    </div>
  );
};

export default VideoFeed;