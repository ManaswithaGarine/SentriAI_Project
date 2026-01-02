import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera,
  AlertTriangle,
  Users,
  Activity,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  RefreshCw,
  MapPin,
  Signal,
  Video,
  ZoomIn,
  X,
  Download,
  Eye,
  AlertCircle
} from 'lucide-react';

const VideoTiles = () => {
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [layout, setLayout] = useState('grid'); // grid, focus, split
  const [filter, setFilter] = useState('all'); // all, alert, high-density
  const videoRefs = useRef({});

  // Camera configurations
  const cameraLocations = [
    { id: 'CAM-001', name: 'Main Gate A', location: 'Entrance', zone: 'Entry' },
    { id: 'CAM-002', name: 'Main Stage', location: 'Performance Area', zone: 'Stage' },
    { id: 'CAM-003', name: 'Food Court North', location: 'Dining Area', zone: 'Food Court' },
    { id: 'CAM-004', name: 'Exit Gate B', location: 'Exit Area', zone: 'Exit' },
    { id: 'CAM-005', name: 'Parking Lot C', location: 'Parking', zone: 'Parking' },
    { id: 'CAM-006', name: 'VIP Section', location: 'VIP Area', zone: 'VIP' },
    { id: 'CAM-007', name: 'Restroom Area', location: 'Facilities', zone: 'Restrooms' },
    { id: 'CAM-008', name: 'Emergency Exit 3', location: 'Exit Route', zone: 'Emergency' },
    { id: 'CAM-009', name: 'Merchandise Booth', location: 'Shopping', zone: 'Retail' }
  ];

  // Initialize cameras
  useEffect(() => {
    const initialCameras = cameraLocations.map((cam, index) => ({
      ...cam,
      status: Math.random() > 0.1 ? 'online' : 'offline',
      streamUrl: `https://example.com/stream/${cam.id}`, // Replace with actual stream URLs
      hasAlert: Math.random() > 0.7,
      crowdDensity: Math.floor(Math.random() * 100),
      peopleCount: Math.floor(Math.random() * 500),
      fps: 25 + Math.floor(Math.random() * 5),
      quality: ['HD', '4K', 'SD'][Math.floor(Math.random() * 3)],
      lastUpdate: new Date(),
      recording: true,
      alertType: null,
      detections: []
    }));

    // Add specific alerts to some cameras
    initialCameras[1].hasAlert = true;
    initialCameras[1].alertType = 'overcrowding';
    initialCameras[1].crowdDensity = 92;
    initialCameras[1].peopleCount = 580;
    initialCameras[1].detections = ['High Crowd Density', 'Unusual Movement'];

    initialCameras[3].hasAlert = true;
    initialCameras[3].alertType = 'unusual_activity';
    initialCameras[3].crowdDensity = 45;
    initialCameras[3].detections = ['Suspicious Behavior Detected'];

    setCameras(initialCameras);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setCameras(prev => prev.map(cam => ({
        ...cam,
        crowdDensity: Math.max(0, Math.min(100, cam.crowdDensity + (Math.random() - 0.5) * 5)),
        peopleCount: Math.max(0, cam.peopleCount + Math.floor((Math.random() - 0.5) * 20)),
        lastUpdate: new Date()
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Get alert priority cameras
  const alertCameras = cameras.filter(cam => cam.hasAlert);
  const highDensityCameras = cameras.filter(cam => cam.crowdDensity > 70);

  // Filter cameras
  const filteredCameras = cameras.filter(cam => {
    if (filter === 'alert') return cam.hasAlert;
    if (filter === 'high-density') return cam.crowdDensity > 70;
    return true;
  });

  // Get grid layout class
  const getGridClass = () => {
    const count = filteredCameras.length;
    if (layout === 'focus') return 'grid-cols-1';
    if (count <= 4) return 'grid-cols-2';
    if (count <= 6) return 'grid-cols-3';
    return 'grid-cols-3';
  };

  // Get density color
  const getDensityColor = (density) => {
    if (density < 30) return 'text-green-600';
    if (density < 60) return 'text-yellow-600';
    if (density < 80) return 'text-orange-600';
    return 'text-red-600';
  };

  const getDensityBg = (density) => {
    if (density < 30) return 'bg-green-100';
    if (density < 60) return 'bg-yellow-100';
    if (density < 80) return 'bg-orange-100';
    return 'bg-red-100';
  };

  // Format time
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // Handle camera actions
  const handleFullscreen = (camera) => {
    setSelectedCamera(camera);
    setLayout('focus');
  };

  const handleExitFullscreen = () => {
    setSelectedCamera(null);
    setLayout('grid');
  };

  const handleSnapshot = (camera) => {
    alert(`Snapshot captured from ${camera.name}`);
  };

  const handleRecording = (cameraId) => {
    setCameras(prev => prev.map(cam =>
      cam.id === cameraId ? { ...cam, recording: !cam.recording } : cam
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Live Camera Feeds</h2>
          <p className="text-sm text-gray-600 mt-1">
            {cameras.filter(c => c.status === 'online').length} of {cameras.length} cameras online
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setLayout('grid')}
            className={`px-4 py-2 rounded flex items-center gap-2 ${
              layout === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Video className="w-4 h-4" />
            Grid
          </button>
          <button
            onClick={() => setLayout('split')}
            className={`px-4 py-2 rounded flex items-center gap-2 ${
              layout === 'split' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Maximize2 className="w-4 h-4" />
            Split
          </button>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex gap-4 mb-6 items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded text-sm font-semibold ${
              filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Cameras ({cameras.length})
          </button>
          <button
            onClick={() => setFilter('alert')}
            className={`px-4 py-2 rounded text-sm font-semibold flex items-center gap-2 ${
              filter === 'alert' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            Alerts ({alertCameras.length})
          </button>
          <button
            onClick={() => setFilter('high-density')}
            className={`px-4 py-2 rounded text-sm font-semibold flex items-center gap-2 ${
              filter === 'high-density' ? 'bg-orange-600 text-white' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
            }`}
          >
            <Users className="w-4 h-4" />
            High Density ({highDensityCameras.length})
          </button>
        </div>

        {alertCameras.length > 0 && (
          <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded border-2 border-red-300 ml-auto">
            <AlertCircle className="w-5 h-5 text-red-600 animate-pulse" />
            <span className="text-sm font-bold text-red-700">
              {alertCameras.length} Active Alert{alertCameras.length > 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Fullscreen View */}
      {selectedCamera && layout === 'focus' && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center p-8">
          <div className="relative w-full h-full max-w-7xl max-h-[90vh] bg-gray-900 rounded-lg overflow-hidden">
            {/* Fullscreen Camera Feed */}
            <div className="relative w-full h-full bg-gray-800 flex items-center justify-center">
              {/* Simulated Video Feed */}
              <div className="relative w-full h-full">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="w-32 h-32 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">Live Feed: {selectedCamera.name}</p>
                    <p className="text-gray-500 text-sm mt-2">Stream URL: {selectedCamera.streamUrl}</p>
                  </div>
                </div>

                {/* Overlay Info */}
                <div className="absolute top-4 left-4 bg-black bg-opacity-70 px-4 py-2 rounded">
                  <div className="flex items-center gap-2 text-white">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="font-semibold">{selectedCamera.id}</span>
                    <span>•</span>
                    <span>{selectedCamera.name}</span>
                  </div>
                </div>

                <div className="absolute top-4 right-4 bg-black bg-opacity-70 px-4 py-2 rounded text-white">
                  <div className="text-sm">{formatTime(selectedCamera.lastUpdate)}</div>
                </div>

                {/* Alert Banner */}
                {selectedCamera.hasAlert && (
                  <div className="absolute top-20 left-4 right-4 bg-red-600 text-white px-4 py-3 rounded flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 animate-pulse" />
                    <div>
                      <div className="font-bold text-lg">ALERT: {selectedCamera.alertType?.replace('_', ' ').toUpperCase()}</div>
                      {selectedCamera.detections.map((detection, idx) => (
                        <div key={idx} className="text-sm">• {detection}</div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stats Overlay */}
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 px-4 py-3 rounded text-white space-y-2">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5" />
                    <div>
                      <div className="text-xs text-gray-400">People Count</div>
                      <div className="text-xl font-bold">{selectedCamera.peopleCount}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5" />
                    <div>
                      <div className="text-xs text-gray-400">Crowd Density</div>
                      <div className={`text-xl font-bold ${getDensityColor(selectedCamera.crowdDensity)}`}>
                        {selectedCamera.crowdDensity}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <button
                    onClick={() => handleSnapshot(selectedCamera)}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleExitFullscreen}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded"
                  >
                    <Minimize2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleExitFullscreen}
                    className="bg-red-600 hover:bg-red-700 text-white p-3 rounded"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid View */}
      <div className={`grid ${getGridClass()} gap-4`}>
        {filteredCameras.map(camera => (
          <div
            key={camera.id}
            className={`relative bg-gray-900 rounded-lg overflow-hidden border-2 ${
              camera.hasAlert ? 'border-red-500' : 'border-gray-700'
            } hover:shadow-xl transition-all`}
          >
            {/* Video Feed Area */}
            <div className="relative aspect-video bg-gray-800 flex items-center justify-center">
              {camera.status === 'online' ? (
                <>
                  {/* Simulated Feed */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Camera className="w-16 h-16 text-gray-600" />
                  </div>
                  
                  {/* Recording Indicator */}
                  {camera.recording && (
                    <div className="absolute top-2 left-2 flex items-center gap-2 bg-red-600 px-2 py-1 rounded text-white text-xs font-semibold">
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                      REC
                    </div>
                  )}

                  {/* Camera Info */}
                  <div className="absolute top-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded">
                    <div className="flex items-center gap-2 text-white text-xs">
                      <Signal className="w-3 h-3" />
                      <span>{camera.quality}</span>
                      <span>•</span>
                      <span>{camera.fps} FPS</span>
                    </div>
                  </div>

                  {/* Alert Badge */}
                  {camera.hasAlert && (
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-red-600 px-3 py-1 rounded-full flex items-center gap-2 animate-pulse">
                      <AlertTriangle className="w-4 h-4 text-white" />
                      <span className="text-white text-xs font-bold">ALERT</span>
                    </div>
                  )}

                  {/* Density Badge */}
                  <div className={`absolute bottom-2 left-2 ${getDensityBg(camera.crowdDensity)} px-3 py-1 rounded`}>
                    <div className="flex items-center gap-2">
                      <Users className={`w-4 h-4 ${getDensityColor(camera.crowdDensity)}`} />
                      <span className={`text-sm font-bold ${getDensityColor(camera.crowdDensity)}`}>
                        {camera.crowdDensity}%
                      </span>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleFullscreen(camera)}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleSnapshot(camera)}
                      className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-500">
                  <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Camera Offline</p>
                </div>
              )}
            </div>

            {/* Camera Details */}
            <div className="bg-gray-800 p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-bold text-white text-sm">{camera.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                    <MapPin className="w-3 h-3" />
                    <span>{camera.location}</span>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-semibold ${
                  camera.status === 'online' ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'
                }`}>
                  {camera.id}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-gray-700 rounded p-2">
                  <div className="text-gray-400">People</div>
                  <div className="text-white font-bold">{camera.peopleCount}</div>
                </div>
                <div className="bg-gray-700 rounded p-2">
                  <div className="text-gray-400">Density</div>
                  <div className={`font-bold ${getDensityColor(camera.crowdDensity)}`}>
                    {camera.crowdDensity}%
                  </div>
                </div>
              </div>

              {/* Detections */}
              {camera.detections.length > 0 && (
                <div className="mt-2 bg-red-900 bg-opacity-30 border border-red-600 rounded p-2">
                  {camera.detections.map((detection, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-red-300">
                      <AlertCircle className="w-3 h-3" />
                      <span>{detection}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleFullscreen(camera)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-xs font-semibold flex items-center justify-center gap-1"
                >
                  <Eye className="w-3 h-3" />
                  View
                </button>
                <button
                  onClick={() => handleRecording(camera.id)}
                  className={`px-3 py-2 rounded text-xs font-semibold ${
                    camera.recording 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-gray-600 hover:bg-gray-500 text-white'
                  }`}
                >
                  {camera.recording ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCameras.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>No cameras match the selected filter</p>
        </div>
      )}
    </div>
  );
};

export default VideoTiles;