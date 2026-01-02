import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Sliders,
  Bell,
  Camera,
  Users,
  Shield,
  AlertTriangle,
  Volume2,
  Moon,
  Palette,
  Brain,
  Target,
  Wifi,
  Lock,
  Save,
  RotateCcw
} from 'lucide-react';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    // Appearance
    darkMode: true,
    
    // Notifications
    enableAlerts: true,
    soundAlerts: true,
    emailNotifications: false,
    
    // Detection Sensitivity
    crowdDetectionSensitivity: 75,
    anomalyDetectionSensitivity: 60,
    faceDetectionEnabled: true,
    
    // Alert Thresholds
    crowdDensityThreshold: 70,
    overcrowdingThreshold: 85,
    panicThreshold: 60,
    responseTimeAlert: 5,
    
    // Camera Management
    activeCameras: [1, 2, 3, 4, 5, 6],
    autoFailover: true,
    recordingEnabled: true,
    
    // AI Model
    aiModel: 'SentriAI-v1',
    processingSpeed: 'balanced',
    
    // Event Type
    eventType: 'concert',
    expectedAttendance: 10000
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  const handleReset = () => {
    if (window.confirm('Reset all settings to default?')) {
      // Reset logic here
      alert('Settings reset to default');
    }
  };

  const eventTypes = [
    { value: 'concert', label: 'Concert/Music Festival' },
    { value: 'stadium', label: 'Stadium/Sports Event' },
    { value: 'pilgrimage', label: 'Pilgrimage/Religious Gathering' },
    { value: 'conference', label: 'Conference/Convention' },
    { value: 'protest', label: 'Public Gathering/Protest' },
    { value: 'custom', label: 'Custom Event' }
  ];

  const aiModels = [
    { value: 'SentriAI-v1', label: 'SentriAI v1.0 (Recommended)' },
    { value: 'SentriAI-v2', label: 'SentriAI v2.0 (Beta)' },
    { value: 'SentriAI-lite', label: 'SentriAI Lite (Low Resource)' }
  ];

  const cameras = [
    { id: 1, name: 'Main Entrance', zone: 'Entrance A' },
    { id: 2, name: 'Exit Gate B', zone: 'Exit B' },
    { id: 3, name: 'Main Stage', zone: 'Stage' },
    { id: 4, name: 'Food Court', zone: 'Food Area' },
    { id: 5, name: 'Parking Lot', zone: 'Parking' },
    { id: 6, name: 'Restrooms', zone: 'Facilities' }
  ];

  const toggleCamera = (cameraId) => {
    setSettings(prev => ({
      ...prev,
      activeCameras: prev.activeCameras.includes(cameraId)
        ? prev.activeCameras.filter(id => id !== cameraId)
        : [...prev.activeCameras, cameraId]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-gray-400" />
          Settings
        </h1>
        <p className="text-gray-400 max-w-4xl">
          Empower your event management with full customization. Adjust detection sensitivity, set crowd alert thresholds, 
          and manage cameras to adapt SentriAI for concerts, stadiums, pilgrimages, and any gathering size — 
          making safety personalized and proactive.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Main Settings */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Event Configuration */}
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-400" />
              Event Configuration
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Event Type
                </label>
                <select
                  value={settings.eventType}
                  onChange={(e) => handleSettingChange('eventType', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {eventTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Expected Attendance: {settings.expectedAttendance.toLocaleString()}
                </label>
                <input
                  type="range"
                  min="100"
                  max="100000"
                  step="1000"
                  value={settings.expectedAttendance}
                  onChange={(e) => handleSettingChange('expectedAttendance', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>100</span>
                  <span>Small (1K)</span>
                  <span>Medium (10K)</span>
                  <span>Large (50K)</span>
                  <span>100K+</span>
                </div>
              </div>
            </div>
          </div>

          {/* Detection Sensitivity */}
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-purple-400" />
              Detection Sensitivity
            </h2>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-300">
                    Crowd Detection Sensitivity
                  </label>
                  <span className="text-sm font-bold text-purple-400">
                    {settings.crowdDetectionSensitivity}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.crowdDetectionSensitivity}
                  onChange={(e) => handleSettingChange('crowdDetectionSensitivity', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Higher sensitivity detects crowds more aggressively
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-300">
                    Anomaly Detection Sensitivity
                  </label>
                  <span className="text-sm font-bold text-orange-400">
                    {settings.anomalyDetectionSensitivity}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.anomalyDetectionSensitivity}
                  onChange={(e) => handleSettingChange('anomalyDetectionSensitivity', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Detects unusual behavior and suspicious activities
                </p>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-medium text-gray-300">Face Detection</span>
                </div>
                <button
                  onClick={() => handleSettingChange('faceDetectionEnabled', !settings.faceDetectionEnabled)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                    settings.faceDetectionEnabled
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-600 text-gray-300'
                  }`}
                >
                  {settings.faceDetectionEnabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>
          </div>

          {/* Alert Thresholds */}
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Alert Thresholds
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-300">
                    Crowd Density Alert
                  </label>
                  <span className="text-sm font-bold text-yellow-400">
                    {settings.crowdDensityThreshold}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.crowdDensityThreshold}
                  onChange={(e) => handleSettingChange('crowdDensityThreshold', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-300">
                    Overcrowding Alert
                  </label>
                  <span className="text-sm font-bold text-red-400">
                    {settings.overcrowdingThreshold}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.overcrowdingThreshold}
                  onChange={(e) => handleSettingChange('overcrowdingThreshold', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-300">
                    Panic Level Alert
                  </label>
                  <span className="text-sm font-bold text-orange-400">
                    {settings.panicThreshold}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.panicThreshold}
                  onChange={(e) => handleSettingChange('panicThreshold', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-300">
                    Response Time (min)
                  </label>
                  <span className="text-sm font-bold text-green-400">
                    {settings.responseTimeAlert}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={settings.responseTimeAlert}
                  onChange={(e) => handleSettingChange('responseTimeAlert', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Camera Management */}
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Camera className="w-5 h-5 text-cyan-400" />
              Camera Management
            </h2>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              {cameras.map(camera => (
                <div
                  key={camera.id}
                  className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    settings.activeCameras.includes(camera.id)
                      ? 'bg-green-900/20 border-green-600'
                      : 'bg-gray-700 border-gray-600'
                  }`}
                  onClick={() => toggleCamera(camera.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-white">{camera.name}</span>
                    <div className={`w-3 h-3 rounded-full ${
                      settings.activeCameras.includes(camera.id) ? 'bg-green-500' : 'bg-gray-500'
                    }`}></div>
                  </div>
                  <span className="text-xs text-gray-400">{camera.zone}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-2">
                <Wifi className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium text-gray-300">Auto Camera Failover</span>
              </div>
              <button
                onClick={() => handleSettingChange('autoFailover', !settings.autoFailover)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                  settings.autoFailover
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-600 text-gray-300'
                }`}
              >
                {settings.autoFailover ? 'On' : 'Off'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Secondary Settings */}
        <div className="space-y-6">
          
          {/* Appearance */}
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5 text-pink-400" />
              Appearance
            </h2>
            
            <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-2">
                <Moon className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-300">Dark Mode</span>
              </div>
              <button
                onClick={() => handleSettingChange('darkMode', !settings.darkMode)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                  settings.darkMode ? 'bg-gray-600 text-gray-300' : 'bg-blue-600 text-white'
                }`}
              >
                {settings.darkMode ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-yellow-400" />
              Notifications
            </h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <span className="text-sm font-medium text-gray-300">Enable Alerts</span>
                <button
                  onClick={() => handleSettingChange('enableAlerts', !settings.enableAlerts)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                    settings.enableAlerts ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
                  }`}
                >
                  {settings.enableAlerts ? 'On' : 'Off'}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-300">Sound Alerts</span>
                </div>
                <button
                  onClick={() => handleSettingChange('soundAlerts', !settings.soundAlerts)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                    settings.soundAlerts ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
                  }`}
                >
                  {settings.soundAlerts ? 'On' : 'Off'}
                </button>
              </div>
            </div>
          </div>

          {/* AI Model */}
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-400" />
              AI Model Settings
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Model
                </label>
                <select
                  value={settings.aiModel}
                  onChange={(e) => handleSettingChange('aiModel', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {aiModels.map(model => (
                    <option key={model.value} value={model.value}>{model.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Processing Speed
                </label>
                <select
                  value={settings.processingSpeed}
                  onChange={(e) => handleSettingChange('processingSpeed', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="fast">Fast (Lower Accuracy)</option>
                  <option value="balanced">Balanced (Recommended)</option>
                  <option value="accurate">Accurate (Slower)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleSave}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              <Save className="w-5 h-5" />
              Save Settings
            </button>

            <button
              onClick={handleReset}
              className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <RotateCcw className="w-5 h-5" />
              Reset to Default
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;