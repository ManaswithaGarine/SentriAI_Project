import React, { useState, useEffect } from 'react';
import { MapPin, Camera, AlertTriangle, Users, Activity } from 'lucide-react';

const LiveEventMap = () => {
  const [crowdData, setCrowdData] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [mapCenter, setMapCenter] = useState({ x: 400, y: 300 });
  const [zoom, setZoom] = useState(1);

  // Sample data - replace with actual API calls
  useEffect(() => {
    // Simulate initial data
    setCameras([
      { id: 1, x: 150, y: 150, name: 'Entrance Gate A', status: 'active' },
      { id: 2, x: 650, y: 150, name: 'Main Stage', status: 'active' },
      { id: 3, x: 150, y: 450, name: 'Food Court', status: 'active' },
      { id: 4, x: 650, y: 450, name: 'Exit Gate B', status: 'alert' },
    ]);

    setCrowdData([
      { id: 1, x: 200, y: 200, density: 45, level: 'low', count: 120 },
      { id: 2, x: 600, y: 180, density: 85, level: 'high', count: 450 },
      { id: 3, x: 180, y: 400, density: 60, level: 'medium', count: 250 },
      { id: 4, x: 620, y: 420, density: 95, level: 'critical', count: 580 },
    ]);

    setIncidents([
      { id: 1, x: 620, y: 420, type: 'overcrowding', severity: 'high', time: '2 mins ago' },
      { id: 2, x: 600, y: 180, type: 'unusual_activity', severity: 'medium', time: '5 mins ago' },
    ]);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setCrowdData(prev => prev.map(zone => ({
        ...zone,
        density: Math.min(100, Math.max(20, zone.density + (Math.random() - 0.5) * 10)),
        count: Math.floor(zone.count + (Math.random() - 0.5) * 50)
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getDensityColor = (level) => {
    switch(level) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      case 'critical': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'low': return '#3b82f6';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getDensityLevel = (density) => {
    if (density < 40) return 'low';
    if (density < 70) return 'medium';
    if (density < 90) return 'high';
    return 'critical';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Live Event Map</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setZoom(Math.min(2, zoom + 0.2))}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            +
          </button>
          <button 
            onClick={() => setZoom(Math.max(0.5, zoom - 0.2))}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            -
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-4 text-sm flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500"></div>
          <span>Low Density</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
          <span>Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500"></div>
          <span>High</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-700"></div>
          <span>Critical</span>
        </div>
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-blue-600" />
          <span>Cameras</span>
        </div>
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-orange-600" />
          <span>Incidents</span>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ height: '500px' }}>
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 800 600"
          className="border border-gray-300"
        >
          {/* Grid Background */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="800" height="600" fill="url(#grid)" />

          {/* Venue Areas */}
          <rect x="100" y="100" width="250" height="200" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="2" rx="8" />
          <text x="225" y="200" textAnchor="middle" className="text-sm fill-gray-600">Main Arena</text>

          <rect x="450" y="100" width="250" height="200" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="2" rx="8" />
          <text x="575" y="200" textAnchor="middle" className="text-sm fill-gray-600">Stage Area</text>

          <rect x="100" y="350" width="250" height="150" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="2" rx="8" />
          <text x="225" y="425" textAnchor="middle" className="text-sm fill-gray-600">Food Court</text>

          <rect x="450" y="350" width="250" height="150" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="2" rx="8" />
          <text x="575" y="425" textAnchor="middle" className="text-sm fill-gray-600">Exit Zone</text>

          {/* Crowd Density Zones */}
          {crowdData.map(zone => {
            const level = getDensityLevel(zone.density);
            return (
              <g key={zone.id}>
                <circle
                  cx={zone.x}
                  cy={zone.y}
                  r={30 + zone.density / 3}
                  fill={getDensityColor(level)}
                  opacity="0.3"
                  className="cursor-pointer transition-all"
                  onClick={() => setSelectedMarker({ type: 'crowd', data: zone })}
                />
                <circle
                  cx={zone.x}
                  cy={zone.y}
                  r="8"
                  fill={getDensityColor(level)}
                  className="cursor-pointer"
                  onClick={() => setSelectedMarker({ type: 'crowd', data: zone })}
                />
              </g>
            );
          })}

          {/* Camera Markers */}
          {cameras.map(camera => (
            <g 
              key={camera.id}
              transform={`translate(${camera.x}, ${camera.y})`}
              className="cursor-pointer"
              onClick={() => setSelectedMarker({ type: 'camera', data: camera })}
            >
              <circle
                r="20"
                fill={camera.status === 'alert' ? '#fef3c7' : '#dbeafe'}
                opacity="0.8"
              />
              <circle
                r="15"
                fill={camera.status === 'alert' ? '#f59e0b' : '#3b82f6'}
              />
              <path
                d="M-6,-4 L-6,4 L-2,4 L-2,6 L6,0 L-2,-6 L-2,-4 Z"
                fill="white"
              />
            </g>
          ))}

          {/* Incident Markers */}
          {incidents.map(incident => (
            <g
              key={incident.id}
              transform={`translate(${incident.x}, ${incident.y})`}
              className="cursor-pointer animate-pulse"
              onClick={() => setSelectedMarker({ type: 'incident', data: incident })}
            >
              <circle
                r="25"
                fill={getSeverityColor(incident.severity)}
                opacity="0.2"
              />
              <circle
                r="18"
                fill={getSeverityColor(incident.severity)}
                opacity="0.5"
              />
              <path
                d="M0,-10 L8,8 L-8,8 Z"
                fill="white"
              />
              <text
                y="3"
                textAnchor="middle"
                className="text-xs font-bold"
                fill={getSeverityColor(incident.severity)}
              >
                !
              </text>
            </g>
          ))}
        </svg>

        {/* Info Panel */}
        {selectedMarker && (
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-xl p-4 w-64 border-2 border-blue-500">
            <button
              onClick={() => setSelectedMarker(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            
            {selectedMarker.type === 'crowd' && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-lg">Crowd Zone</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Density:</span>
                    <span className="font-semibold">{Math.round(selectedMarker.data.density)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">People Count:</span>
                    <span className="font-semibold">{selectedMarker.data.count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Level:</span>
                    <span className={`font-semibold capitalize ${
                      getDensityLevel(selectedMarker.data.density) === 'critical' ? 'text-red-600' :
                      getDensityLevel(selectedMarker.data.density) === 'high' ? 'text-orange-600' :
                      getDensityLevel(selectedMarker.data.density) === 'medium' ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {getDensityLevel(selectedMarker.data.density)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {selectedMarker.type === 'camera' && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Camera className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-lg">Camera</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-semibold text-sm">{selectedMarker.data.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-semibold capitalize ${
                      selectedMarker.data.status === 'alert' ? 'text-orange-600' : 'text-green-600'
                    }`}>
                      {selectedMarker.data.status}
                    </span>
                  </div>
                  <button className="w-full mt-2 bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                    View Feed
                  </button>
                </div>
              </div>
            )}

            {selectedMarker.type === 'incident' && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <h3 className="font-bold text-lg">Incident</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-semibold text-sm capitalize">
                      {selectedMarker.data.type.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Severity:</span>
                    <span className={`font-semibold capitalize ${
                      selectedMarker.data.severity === 'high' ? 'text-red-600' :
                      selectedMarker.data.severity === 'medium' ? 'text-yellow-600' :
                      'text-blue-600'
                    }`}>
                      {selectedMarker.data.severity}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-semibold text-sm">{selectedMarker.data.time}</span>
                  </div>
                  <button className="w-full mt-2 bg-red-500 text-white py-2 rounded hover:bg-red-600">
                    Dispatch Responder
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-4 mt-4">
        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
          <div className="text-green-800 text-sm font-semibold">Safe Zones</div>
          <div className="text-2xl font-bold text-green-600">
            {crowdData.filter(z => getDensityLevel(z.density) === 'low').length}
          </div>
        </div>
        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
          <div className="text-yellow-800 text-sm font-semibold">Medium Alert</div>
          <div className="text-2xl font-bold text-yellow-600">
            {crowdData.filter(z => getDensityLevel(z.density) === 'medium').length}
          </div>
        </div>
        <div className="bg-red-50 p-3 rounded-lg border border-red-200">
          <div className="text-red-800 text-sm font-semibold">High Risk</div>
          <div className="text-2xl font-bold text-red-600">
            {crowdData.filter(z => getDensityLevel(z.density) === 'high' || getDensityLevel(z.density) === 'critical').length}
          </div>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <div className="text-blue-800 text-sm font-semibold">Active Cameras</div>
          <div className="text-2xl font-bold text-blue-600">
            {cameras.filter(c => c.status === 'active').length}/{cameras.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveEventMap;