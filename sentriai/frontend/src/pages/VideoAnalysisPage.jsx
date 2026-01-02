import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Video, 
  Play, 
  Pause, 
  AlertTriangle, 
  CheckCircle,
  Users,
  Activity,
  Clock,
  TrendingUp,
  AlertCircle,
  X,
  FileVideo
} from 'lucide-react';

const VideoUploadAnalyzer = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [alerts, setAlerts] = useState([]);
  const [analytics, setAnalytics] = useState({
    crowdDensity: 0,
    peopleCount: 0,
    riskLevel: 'low',
    avgDensity: 0
  });

  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const analysisIntervalRef = useRef(null);

  // Simulate AI analysis based on video playback
  const analyzeFrame = (time) => {
    // Simulate crowd detection and density analysis
    // In production, this would call your AI backend
    
    const density = Math.min(100, 30 + Math.sin(time / 10) * 40 + Math.random() * 30);
    const peopleCount = Math.floor(density * 5);
    
    let riskLevel = 'low';
    if (density > 80) riskLevel = 'critical';
    else if (density > 60) riskLevel = 'high';
    else if (density > 40) riskLevel = 'medium';

    setAnalytics({
      crowdDensity: Math.round(density),
      peopleCount,
      riskLevel,
      avgDensity: Math.round(density)
    });

    // Generate alerts for high density
    if (density > 75 && Math.random() > 0.7) {
      const alertTypes = [
        'High crowd density detected',
        'Overcrowding in central area',
        'Potential bottleneck detected',
        'Exit pathway congestion',
        'Unusual crowd movement pattern'
      ];
      
      const newAlert = {
        id: Date.now(),
        time: formatTime(time),
        timestamp: time,
        type: riskLevel,
        message: alertTypes[Math.floor(Math.random() * alertTypes.length)],
        density: Math.round(density),
        peopleCount
      };

      setAlerts(prev => {
        // Avoid duplicate alerts at same timestamp
        if (prev.some(alert => Math.abs(alert.timestamp - time) < 2)) {
          return prev;
        }
        return [...prev, newAlert].slice(-10); // Keep last 10 alerts
      });
    }
  };

  // Replace your existing handleFileUpload with this function
const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file || !file.type.startsWith('video/')) {
    alert('Please upload a valid video file');
    return;
  }

  // Local preview still useful
  setVideoFile(file);
  const url = URL.createObjectURL(file);
  setVideoUrl(url);
  setAlerts([]);
  setAnalytics({
    crowdDensity: 0,
    peopleCount: 0,
    riskLevel: 'low',
    avgDensity: 0
  });

  // Upload to backend for analysis
  const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000";
  const formData = new FormData();
  formData.append('video', file);

  try {
    setIsAnalyzing(true);

    // Optional: show a small delay to ensure spinner appears before heavy upload
    await new Promise(res => setTimeout(res, 100));

    const response = await fetch(`${BACKEND}/api/analyze-video`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Backend error: ${response.status} ${text}`);
    }

    const data = await response.json();

    /**
     * Expected backend JSON shape (example):
     * {
     *   crowdDensity: 67,
     *   peopleCount: 315,
     *   riskLevel: "high",
     *   avgDensity: 67,
     *   alerts: [{ id, time, message, density, peopleCount }, ... ]
     * }
     *
     * If your crowd_detector returns a different shape, adapt the mapping below.
     */

    // Map backend result to frontend state (safe guards)
    setAnalytics({
      crowdDensity: data.crowdDensity ?? data.density ?? 0,
      peopleCount: data.peopleCount ?? data.count ?? 0,
      riskLevel: data.riskLevel ?? (data.crowdDensity > 80 ? 'critical' : (data.crowdDensity > 60 ? 'high' : (data.crowdDensity > 40 ? 'medium' : 'low'))),
      avgDensity: data.avgDensity ?? data.crowdDensity ?? 0
    });

    // If backend returns alerts array, set it; otherwise no alerts
    if (Array.isArray(data.alerts) && data.alerts.length > 0) {
      // Normalize alerts to your frontend format if needed
      const normalized = data.alerts.map(a => ({
        id: a.id ?? Date.now() + Math.floor(Math.random() * 1000),
        time: a.time ?? a.timestamp ?? formatTime(a.timestamp ?? 0),
        timestamp: a.timestamp ?? Date.now(),
        type: a.type ?? (a.level ?? data.riskLevel ?? 'high'),
        message: a.message ?? a.msg ?? 'Alert',
        density: a.density ?? a.crowdDensity ?? 0,
        peopleCount: a.peopleCount ?? a.count ?? 0
      }));
      setAlerts(prev => [...prev, ...normalized].slice(-10));
    }

    // Optionally auto-play preview to visualize (you may keep or remove)
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  } catch (err) {
    console.error(err);
    alert(`Error analyzing video: ${err.message || err}`);
  } finally {
    setIsAnalyzing(false);
  }
};

  // Handle video playback
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
        setIsAnalyzing(true);
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Update current time
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      setCurrentTime(time);
      
      // Analyze frame every 0.5 seconds
      if (isAnalyzing && Math.floor(time * 2) !== Math.floor((time - 0.1) * 2)) {
        analyzeFrame(time);
      }
    }
  };

  // Handle video metadata loaded
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get risk color
  const getRiskColor = (risk) => {
    const colors = {
      low: 'text-green-600',
      medium: 'text-yellow-600',
      high: 'text-orange-600',
      critical: 'text-red-600'
    };
    return colors[risk] || colors.low;
  };

  const getRiskBg = (risk) => {
    const colors = {
      low: 'bg-green-100',
      medium: 'bg-yellow-100',
      high: 'bg-orange-100',
      critical: 'bg-red-100'
    };
    return colors[risk] || colors.low;
  };

  // Remove alert
  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  // Clear video
  const clearVideo = () => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setVideoFile(null);
    setVideoUrl(null);
    setIsPlaying(false);
    setIsAnalyzing(false);
    setCurrentTime(0);
    setDuration(0);
    setAlerts([]);
    setAnalytics({
      crowdDensity: 0,
      peopleCount: 0,
      riskLevel: 'low',
      avgDensity: 0
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Video Analysis System</h1>
          <p className="text-gray-400">Upload a video to analyze crowd density and detect potential safety issues</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Video Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upload Area or Video Player */}
            {!videoUrl ? (
              <div className="bg-gray-800 rounded-2xl p-12 border-2 border-dashed border-gray-600 hover:border-blue-500 transition-colors">
                <div className="text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="video-upload"
                  />
                  <label 
                    htmlFor="video-upload"
                    className="cursor-pointer"
                  >
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-600 rounded-full mb-6 hover:bg-blue-700 transition-colors">
                      <Upload className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Upload Video</h3>
                    <p className="text-gray-400 mb-6">
                      Click to browse or drag and drop your video file
                    </p>
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
                      <FileVideo className="w-5 h-5" />
                      Choose File
                    </div>
                  </label>
                  <p className="text-gray-500 text-sm mt-4">
                    Supported formats: MP4, WebM, AVI, MOV
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Video Player */}
                <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-2xl">
                  <div className="relative">
                    <video
                      ref={videoRef}
                      src={videoUrl}
                      className="w-full"
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                      onEnded={() => {
                        setIsPlaying(false);
                        setIsAnalyzing(false);
                      }}
                    />
                    
                    {/* Video Overlay with Analytics */}
                    {isAnalyzing && (
                      <div className="absolute top-4 left-4 right-4">
                        <div className="bg-black/70 backdrop-blur-sm rounded-lg p-4">
                          <div className="grid grid-cols-3 gap-4 text-white">
                            <div>
                              <div className="text-xs text-gray-300 mb-1">Crowd Density</div>
                              <div className={`text-2xl font-bold ${getRiskColor(analytics.riskLevel)}`}>
                                {analytics.crowdDensity}%
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-300 mb-1">People Count</div>
                              <div className="text-2xl font-bold text-blue-400">
                                {analytics.peopleCount}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-300 mb-1">Risk Level</div>
                              <div className={`text-2xl font-bold uppercase ${getRiskColor(analytics.riskLevel)}`}>
                                {analytics.riskLevel}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Alert Overlay */}
                    {analytics.riskLevel === 'critical' && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="bg-red-500/20 backdrop-blur-sm rounded-full p-8 animate-pulse">
                          <AlertTriangle className="w-24 h-24 text-red-500" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="bg-gray-900 p-4">
                    <div className="flex items-center gap-4 mb-4">
                      <button
                        onClick={togglePlay}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-colors"
                      >
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                      </button>
                      
                      <div className="flex-1">
                        <input
                          type="range"
                          min="0"
                          max={duration || 0}
                          value={currentTime}
                          onChange={(e) => {
                            const time = parseFloat(e.target.value);
                            if (videoRef.current) {
                              videoRef.current.currentTime = time;
                            }
                          }}
                          className="w-full"
                        />
                      </div>

                      <div className="text-white text-sm font-mono">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </div>

                      <button
                        onClick={clearVideo}
                        className="text-gray-400 hover:text-white transition-colors"
                        title="Remove video"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-400">
                        <FileVideo className="w-4 h-4" />
                        {videoFile?.name}
                      </div>
                      {isAnalyzing && (
                        <div className="flex items-center gap-2 text-green-400">
                          <Activity className="w-4 h-4 animate-pulse" />
                          Analyzing...
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Analytics Dashboard */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
                    <div className="flex items-center gap-3 mb-2">
                      <Activity className="w-6 h-6" />
                      <h3 className="font-semibold">Avg Density</h3>
                    </div>
                    <div className="text-3xl font-bold">{analytics.avgDensity}%</div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-white">
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="w-6 h-6" />
                      <h3 className="font-semibold">Total Alerts</h3>
                    </div>
                    <div className="text-3xl font-bold">{alerts.length}</div>
                  </div>

                  <div className={`rounded-xl p-6 text-white ${
                    analytics.riskLevel === 'critical' ? 'bg-gradient-to-br from-red-600 to-red-700' :
                    analytics.riskLevel === 'high' ? 'bg-gradient-to-br from-orange-600 to-orange-700' :
                    analytics.riskLevel === 'medium' ? 'bg-gradient-to-br from-yellow-600 to-yellow-700' :
                    'bg-gradient-to-br from-green-600 to-green-700'
                  }`}>
                    <div className="flex items-center gap-3 mb-2">
                      <AlertCircle className="w-6 h-6" />
                      <h3 className="font-semibold">Risk Status</h3>
                    </div>
                    <div className="text-2xl font-bold uppercase">{analytics.riskLevel}</div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Alerts Panel */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-2xl p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                  Alerts
                </h2>
                {alerts.length > 0 && (
                  <span className="bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                    {alerts.length}
                  </span>
                )}
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {alerts.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <p className="text-gray-400">No alerts detected</p>
                    <p className="text-gray-500 text-sm mt-2">
                      {videoUrl ? 'Play the video to start analysis' : 'Upload a video to begin'}
                    </p>
                  </div>
                ) : (
                  alerts.map(alert => (
                    <div
                      key={alert.id}
                      className={`${getRiskBg(alert.type)} rounded-lg p-4 border-l-4 ${
                        alert.type === 'critical' ? 'border-red-600' :
                        alert.type === 'high' ? 'border-orange-600' :
                        alert.type === 'medium' ? 'border-yellow-600' :
                        'border-blue-600'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className={`w-4 h-4 ${getRiskColor(alert.type)}`} />
                            <span className={`text-xs font-bold uppercase ${getRiskColor(alert.type)}`}>
                              {alert.type}
                            </span>
                          </div>
                          <p className="text-gray-900 font-semibold text-sm mb-2">
                            {alert.message}
                          </p>
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {alert.time}
                            </div>
                            <div className="flex items-center gap-1">
                              <Activity className="w-3 h-3" />
                              {alert.density}%
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {alert.peopleCount} people
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeAlert(alert.id)}
                          className="text-gray-500 hover:text-gray-700 ml-2"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoUploadAnalyzer;