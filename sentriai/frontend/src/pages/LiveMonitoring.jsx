import React, { useState, useEffect } from 'react';
import { 
  Maximize2,
  Minimize2,
  Grid,
  Play,
  Pause,
  AlertTriangle,
  Users,
  Camera,
  MapPin,
  Activity,
  Clock,
  Eye,
  Radio,
  Volume2,
  VolumeX,
  RefreshCw,
  Zap,
  TrendingUp,
  Shield,
  Bell
} from 'lucide-react';

const LiveMonitoring = () => {
  const [layout, setLayout] = useState('quad'); // quad, grid, focus, split
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [alertMode, setAlertMode] = useState(false);

  const [cameras, setCameras] = useState([
    {
      id: 'CAM-001',
      name: 'Main Gate A',
      zone: 'Entrance',
      status: 'online',
      alert: false,
      crowdDensity: 45,
      peopleCount: 120,
      lastUpdate: new Date(),
      priority: 'normal',
      recording: true
    },
    {
      id: 'CAM-002',
      name: 'Main Stage',
      zone: 'Performance',
      status: 'online',
      alert: true,
      crowdDensity: 92,
      peopleCount: 580,
      lastUpdate: new Date(),
      priority: 'critical',
      recording: true,
      alertType: 'Overcrowding'
    },
    {
      id: 'CAM-003',
      name: 'Food Court',
      zone: 'Dining',
      status: 'online',
      alert: false,
      crowdDensity: 62,
      peopleCount: 250,
      lastUpdate: new Date(),
      priority: 'normal',
      recording: true
    },
    {
      id: 'CAM-004',
      name: 'Exit Gate B',
      zone: 'Exit',
      status: 'online',
      alert: true,
      crowdDensity: 78,
      peopleCount: 420,
      lastUpdate: new Date(),
      priority: 'high',
      recording: true,
      alertType: 'High Density'
    },
    {
      id: 'CAM-005',
      name: 'Parking Lot C',
      zone: 'Parking',
      status: 'online',
      alert: false,
      crowdDensity: 35,
      peopleCount: 85,
      lastUpdate: new Date(),
      priority: 'low',
      recording: true
    },
    {
      id: 'CAM-006',
      name: 'VIP Section',
      zone: 'VIP',
      status: 'online',
      alert: false,
      crowdDensity: 55,
      peopleCount: 145,
      lastUpdate: new Date(),
      priority: 'normal',
      recording: true
    },
    {
      id: 'CAM-007',
      name: 'Restroom Area',
      zone: 'Facilities',
      status: 'online',
      alert: false,
      crowdDensity: 48,
      peopleCount: 95,
      lastUpdate: new Date(),
      priority: 'normal',
      recording: true
    },
    {
      id: 'CAM-008',
      name: 'Emergency Exit 3',
      zone: 'Safety',
      status: 'online',
      alert: true,
      crowdDensity: 85,
      peopleCount: 380,
      lastUpdate: new Date(),
      priority: 'high',
      recording: true,
      alertType: 'Blocked Exit'
    },
    {
      id: 'CAM-009',
      name: 'Merchandise',
      zone: 'Retail',
      status: 'online',
      alert: false,
      crowdDensity: 58,
      peopleCount: 180,
      lastUpdate: new Date(),
      priority: 'normal',
      recording: true
    }
  ]);

  const [liveStats, setLiveStats] = useState({
    totalCameras: 9,
    activeCameras: 9,
    activeAlerts: 3,
    totalPeople: 2255,
    avgDensity: 62,
    criticalZones: 2
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCameras(prev => prev.map(cam => ({
        ...cam,
        crowdDensity: Math.max(0, Math.min(100, cam.crowdDensity + (Math.random() - 0.5) * 5)),
        peopleCount: Math.max(0, cam.peopleCount + Math.floor((Math.random() - 0.5) * 20)),
        lastUpdate: new Date()
      })));

      setLiveStats(prev => ({
        ...prev,
        totalPeople: prev.totalPeople + Math.floor((Math.random() - 0.5) * 50),
        avgDensity: Math.max(0, Math.min(100, prev.avgDensity + (Math.random() - 0.5) * 3))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Auto-rotate cameras
  useEffect(() => {
    if (autoRotate && selectedCamera) {
      const interval = setInterval(() => {
        const currentIndex = cameras.findIndex(c => c.id === selectedCamera.id);
        const nextIndex = (currentIndex + 1) % cameras.length;
        setSelectedCamera(cameras[nextIndex]);
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [autoRotate, selectedCamera, cameras]);

  const getDensityColor = (density) => {
    if (density >= 80) return 'text-red-600';
    if (density >= 60) return 'text-orange-600';
    if (density >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getDensityBg = (density) => {
    if (density >= 80) return 'bg-red-100';
    if (density >= 60) return 'bg-orange-100';
    if (density >= 40) return 'bg-yellow-100';
    return 'bg-green-100';
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      critical: 'bg-red-600 text-white',
      high: 'bg-orange-600 text-white',
      normal: 'bg-blue-600 text-white',
      low: 'bg-gray-600 text-white'
    };
    return badges[priority] || badges.normal;
  };

  const getLayoutGrid = () => {
    switch(layout) {
      case 'quad':
        return 'grid-cols-2';
      case 'grid':
        return 'grid-cols-3';
      case 'focus':
        return 'grid-cols-1';
      default:
        return 'grid-cols-2';
    }
  };

  const getDisplayCameras = () => {
    if (layout === 'focus' && selectedCamera) {
      return [selectedCamera];
    }
    if (layout === 'quad') {
      return cameras.slice(0, 4);
    }
    if (alertMode) {
      return cameras.filter(c => c.alert);
    }
    return cameras;
  };

  const handleCameraClick = (camera) => {
    setSelectedCamera(camera);
    if (layout !== 'focus') {
      setLayout('focus');
    }
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className={`bg-gray-900 min-h-screen ${isFullscreen ? 'fixed inset-0 z-50' : 'p-6'}`}>
      {/* Header Controls */}
      <div className="bg-gray-800 rounded-lg p-4 mb-4 border border-gray-700">
        <div className="flex items-center justify-between">
          {/* Left - Title */}
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-2 rounded-lg">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Live Monitoring</h1>
              <p className="text-sm text-gray-400">Real-time surveillance and detection</p>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-red-500">LIVE</span>
            </div>
          </div>

          {/* Right - Controls */}
          <div className="flex items-center gap-2">
            {/* Layout Buttons */}
            <div className="flex gap-1 bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setLayout('quad')}
                className={`p-2 rounded ${layout === 'quad' ? 'bg-blue-600' : 'hover:bg-gray-600'} text-white`}
                title="2x2 Grid"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLayout('grid')}
                className={`p-2 rounded ${layout === 'grid' ? 'bg-blue-600' : 'hover:bg-gray-600'} text-white`}
                title="3x3 Grid"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLayout('focus')}
                className={`p-2 rounded ${layout === 'focus' ? 'bg-blue-600' : 'hover:bg-gray-600'} text-white`}
                title="Focus View"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Feature Buttons */}
            <button
              onClick={() => setAlertMode(!alertMode)}
              className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 ${
                alertMode ? 'bg-red-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              <Bell className="w-4 h-4" />
              Alert Mode
            </button>

            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 ${
                autoRotate ? 'bg-green-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} />
              Auto
            </button>

            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
            >
              {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setShowOverlay(!showOverlay)}
              className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
            >
              <Eye className="w-5 h-5" />
            </button>

            <button
              onClick={handleFullscreen}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-6 gap-4 mt-4">
          <div className="bg-gray-700 rounded-lg p-3">
            <div className="text-gray-400 text-xs mb-1">Total Cameras</div>
            <div className="text-white text-2xl font-bold">{liveStats.totalCameras}</div>
          </div>
          <div className="bg-green-900 rounded-lg p-3">
            <div className="text-green-400 text-xs mb-1">Active</div>
            <div className="text-white text-2xl font-bold">{liveStats.activeCameras}</div>
          </div>
          <div className="bg-red-900 rounded-lg p-3">
            <div className="text-red-400 text-xs mb-1">Active Alerts</div>
            <div className="text-white text-2xl font-bold">{liveStats.activeAlerts}</div>
          </div>
          <div className="bg-blue-900 rounded-lg p-3">
            <div className="text-blue-400 text-xs mb-1">Total People</div>
            <div className="text-white text-2xl font-bold">{liveStats.totalPeople.toLocaleString()}</div>
          </div>
          <div className="bg-orange-900 rounded-lg p-3">
            <div className="text-orange-400 text-xs mb-1">Avg Density</div>
            <div className="text-white text-2xl font-bold">{liveStats.avgDensity}%</div>
          </div>
          <div className="bg-purple-900 rounded-lg p-3">
            <div className="text-purple-400 text-xs mb-1">Critical Zones</div>
            <div className="text-white text-2xl font-bold">{liveStats.criticalZones}</div>
          </div>
        </div>
      </div>

      {/* Camera Grid */}
      <div className={`grid ${getLayoutGrid()} gap-4`}>
        {getDisplayCameras().map(camera => (
          <div
            key={camera.id}
            onClick={() => handleCameraClick(camera)}
            className={`relative bg-black rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
              camera.alert ? 'border-red-500 animate-pulse' : 'border-gray-700'
            } ${selectedCamera?.id === camera.id ? 'ring-4 ring-blue-500' : 'hover:border-gray-500'}`}
            style={{ aspectRatio: '16/9' }}
          >
            {/* Simulated Video Feed */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <Camera className="w-24 h-24 text-gray-600" />
            </div>

            {/* Recording Indicator */}
            {camera.recording && (
              <div className="absolute top-3 left-3 flex items-center gap-2 bg-red-600 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-white text-xs font-bold">REC</span>
              </div>
            )}

            {/* Alert Badge */}
            {camera.alert && (
              <div className="absolute top-3 right-3 bg-red-600 px-3 py-1 rounded-full flex items-center gap-2 animate-pulse">
                <AlertTriangle className="w-4 h-4 text-white" />
                <span className="text-white text-xs font-bold">{camera.alertType}</span>
              </div>
            )}

            {/* Info Overlay */}
            {showOverlay && (
              <>
                {/* Top Info Bar */}
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black to-transparent p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-bold text-lg">{camera.name}</div>
                      <div className="text-gray-300 text-sm flex items-center gap-2">
                        <MapPin className="w-3 h-3" />
                        {camera.zone}
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityBadge(camera.priority)}`}>
                      {camera.id}
                    </div>
                  </div>
                </div>

                {/* Bottom Info Bar */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <div className={`${getDensityBg(camera.crowdDensity)} rounded p-2`}>
                      <div className="flex items-center gap-2">
                        <Activity className={`w-4 h-4 ${getDensityColor(camera.crowdDensity)}`} />
                        <div>
                          <div className="text-xs text-gray-600">Density</div>
                          <div className={`font-bold ${getDensityColor(camera.crowdDensity)}`}>
                            {Math.round(camera.crowdDensity)}%
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-100 rounded p-2">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-600" />
                        <div>
                          <div className="text-xs text-gray-600">People</div>
                          <div className="font-bold text-blue-600">{camera.peopleCount}</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-800 rounded p-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="text-xs text-gray-400">Updated</div>
                          <div className="font-bold text-white text-xs">{formatTime(camera.lastUpdate)}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-semibold">
                      <Eye className="w-4 h-4 inline mr-1" />
                      Focus
                    </button>
                    <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded text-sm font-semibold">
                      <Shield className="w-4 h-4 inline mr-1" />
                      Dispatch
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Status Indicator */}
            <div className={`absolute bottom-3 left-3 w-3 h-3 rounded-full ${
              camera.status === 'online' ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
          </div>
        ))}
      </div>

      {/* Alert Panel (if alert mode) */}
      {alertMode && cameras.filter(c => c.alert).length === 0 && (
        <div className="mt-4 bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Active Alerts</h3>
          <p className="text-gray-400">All zones are operating within normal parameters</p>
        </div>
      )}

      {/* Time Stamp */}
      <div className="mt-4 text-center">
        <div className="inline-flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-gray-300 text-sm font-semibold">
            {formatTime(new Date())}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LiveMonitoring;