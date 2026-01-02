import React, { useState, useEffect } from 'react';
import {
  Users,
  TrendingUp,
  AlertTriangle,
  Clock,
  Download,
  Maximize2,
  Activity,
  MapPin,
  Flame,
  Eye
} from 'lucide-react';

const HeatmapPage = () => {
  const [timeRange, setTimeRange] = useState('live');
  const [alertThreshold, setAlertThreshold] = useState(70);
  const [stats, setStats] = useState({
    totalPeople: 37017,
    avgDensity: 24.8,
    highRiskZones: 32,
    lastUpdated: 'Just now'
  });

  const [heatmapData, setHeatmapData] = useState([]);

  useEffect(() => {
    // Generate sample heatmap data
    const generateHeatmap = () => {
      const zones = [
        { id: 'entrance', name: 'ENTRANCE', x: 2, y: 2, density: 65, color: 'rgba(220, 38, 38, 0.6)' },
        { id: 'main-stage', name: 'MAIN STAGE', x: 8, y: 6, density: 85, color: 'rgba(185, 28, 28, 0.8)' },
        { id: 'food-court', name: 'FOOD COURT', x: 15, y: 3, density: 45, color: 'rgba(220, 38, 38, 0.4)' },
        { id: 'vip-area', name: 'VIP AREA', x: 18, y: 8, density: 35, color: 'rgba(127, 29, 29, 0.5)' },
        { id: 'exit-a', name: 'EXIT A', x: 5, y: 12, density: 55, color: 'rgba(220, 38, 38, 0.5)' },
        { id: 'exit-b', name: 'EXIT B', x: 12, y: 12, density: 50, color: 'rgba(220, 38, 38, 0.45)' },
        { id: 'merchandise', name: 'MERCHANDISE', x: 20, y: 5, density: 40, color: 'rgba(127, 29, 29, 0.4)' },
        { id: 'parking', name: 'PARKING', x: 1, y: 10, density: 25, color: 'rgba(127, 29, 29, 0.3)' }
      ];
      setHeatmapData(zones);
    };

    generateHeatmap();
    const interval = setInterval(generateHeatmap, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalPeople: prev.totalPeople + Math.floor((Math.random() - 0.5) * 100),
        avgDensity: parseFloat((parseFloat(prev.avgDensity) + (Math.random() - 0.5) * 2).toFixed(1)),
        lastUpdated: 'Just now'
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getDensityColor = (density) => {
    if (density >= 80) return 'bg-red-600';
    if (density >= 60) return 'bg-red-500';
    if (density >= 40) return 'bg-red-400';
    return 'bg-red-300';
  };

  const getDensityLabel = (density) => {
    if (density >= 80) return 'Critical';
    if (density >= 60) return 'High';
    if (density >= 40) return 'Moderate';
    return 'Low';
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-red-500 mb-2 flex items-center gap-3">
                <Flame className="w-10 h-10 text-red-600 animate-pulse" />
                Crowd Density Heatmap
              </h1>
              <p className="text-red-300/70">Real-time visualization of crowd movement patterns</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all shadow-lg shadow-red-900/50 hover:shadow-red-800/70 border border-red-500">
                <Download className="w-5 h-5" />
                Export
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-red-950 text-red-400 rounded-lg transition-all border-2 border-red-600">
                <Maximize2 className="w-5 h-5" />
                Fullscreen
              </button>
            </div>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="bg-gradient-to-r from-black via-red-950/30 to-black border-2 border-red-600/50 rounded-xl p-6 mb-6 shadow-lg shadow-red-900/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Time Range Selector */}
            <div className="flex gap-2">
              {['live', 'lastHour', 'lastDay'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    timeRange === range
                      ? 'bg-red-600 text-white shadow-lg shadow-red-900/50 border border-red-500'
                      : 'bg-black text-red-400 hover:bg-red-950 border border-red-900'
                  }`}
                >
                  {range === 'live' ? 'Live' : range === 'lastHour' ? 'Last Hour' : 'Last Day'}
                </button>
              ))}
            </div>

            {/* Alert Threshold */}
            <div className="flex items-center gap-4 w-full md:w-auto">
              <span className="text-red-400 font-semibold whitespace-nowrap">Alert Threshold:</span>
              <input
                type="range"
                min="0"
                max="100"
                value={alertThreshold}
                onChange={(e) => setAlertThreshold(e.target.value)}
                className="flex-1 md:w-48 h-2 bg-red-950 rounded-lg appearance-none cursor-pointer slider-red"
              />
              <span className="text-white font-bold bg-red-600 px-3 py-1 rounded-lg min-w-[60px] text-center shadow-lg shadow-red-900/50 border border-red-500">
                {alertThreshold}%
              </span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-black to-red-950/30 border-2 border-red-600/50 rounded-xl p-6 hover:border-red-500 hover:shadow-lg hover:shadow-red-900/50 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-red-400 text-sm flex items-center gap-2 font-semibold">
                <Activity className="w-4 h-4" />
                Total People
              </span>
            </div>
            <div className="text-3xl font-bold text-red-300">{stats.totalPeople.toLocaleString()}</div>
          </div>

          <div className="bg-gradient-to-br from-black to-red-950/30 border-2 border-red-600/50 rounded-xl p-6 hover:border-red-500 hover:shadow-lg hover:shadow-red-900/50 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-red-400 text-sm flex items-center gap-2 font-semibold">
                <TrendingUp className="w-4 h-4" />
                Avg Density
              </span>
            </div>
            <div className="text-3xl font-bold text-red-300">{stats.avgDensity}%</div>
          </div>

          <div className="bg-gradient-to-br from-black to-red-950/30 border-2 border-red-600/50 rounded-xl p-6 hover:border-red-500 hover:shadow-lg hover:shadow-red-900/50 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-red-400 text-sm flex items-center gap-2 font-semibold">
                <AlertTriangle className="w-4 h-4" />
                High Risk Zones
              </span>
            </div>
            <div className="text-3xl font-bold text-red-500 animate-pulse">{stats.highRiskZones}</div>
          </div>

          <div className="bg-gradient-to-br from-black to-red-950/30 border-2 border-red-600/50 rounded-xl p-6 hover:border-red-500 hover:shadow-lg hover:shadow-red-900/50 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-red-400 text-sm flex items-center gap-2 font-semibold">
                <Clock className="w-4 h-4" />
                Updated
              </span>
            </div>
            <div className="text-3xl font-bold text-white">{stats.lastUpdated}</div>
          </div>
        </div>

        {/* Main Heatmap */}
        <div className="bg-gradient-to-br from-black via-red-950/20 to-black border-2 border-red-600/50 rounded-xl p-6 mb-6 shadow-xl shadow-red-900/40">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-red-500 flex items-center gap-2">
              <Eye className="w-6 h-6 text-red-600" />
              Live Heatmap View
            </h3>
            <div className="flex items-center gap-2 bg-red-600 px-3 py-1 rounded-full border border-red-500 shadow-lg shadow-red-900/50">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-xs font-bold text-white">LIVE</span>
            </div>
          </div>

          {/* Heatmap Grid */}
          <div className="bg-gradient-to-br from-black via-red-950/10 to-black rounded-lg p-8 relative overflow-hidden border-2 border-red-900/50">
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-10">
              <div className="grid grid-cols-20 grid-rows-15 h-full w-full">
                {[...Array(300)].map((_, i) => (
                  <div key={i} className="border border-red-600/30"></div>
                ))}
              </div>
            </div>

            {/* Heatmap Zones */}
            <div className="relative h-96 md:h-[500px]">
              {heatmapData.map((zone) => (
                <div
                  key={zone.id}
                  className="absolute transition-all duration-500 rounded-lg border-2 border-red-500/40 hover:border-red-500 cursor-pointer group"
                  style={{
                    left: `${zone.x * 4}%`,
                    top: `${zone.y * 6}%`,
                    width: '12%',
                    height: '15%',
                    backgroundColor: zone.color,
                    boxShadow: zone.density >= 70 ? '0 0 25px rgba(220, 38, 38, 0.7)' : '0 0 15px rgba(127, 29, 29, 0.4)'
                  }}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white font-bold text-xs p-2">
                    <span className="opacity-80 group-hover:opacity-100 transition-opacity drop-shadow-lg">{zone.name}</span>
                    <span className="text-lg group-hover:scale-110 transition-transform drop-shadow-lg">{zone.density}%</span>
                  </div>
                  
                  {/* Tooltip on Hover */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                    <div className="bg-black border-2 border-red-600 rounded-lg p-3 shadow-2xl shadow-red-900/70 whitespace-nowrap">
                      <div className="text-red-400 font-bold mb-1">{zone.name}</div>
                      <div className="text-red-300/70 text-xs">Density: {zone.density}%</div>
                      <div className="text-red-300/70 text-xs">Status: {getDensityLabel(zone.density)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 right-4 bg-black/95 border-2 border-red-600/70 rounded-lg p-4 backdrop-blur shadow-lg shadow-red-900/50">
              <h4 className="text-red-400 font-bold mb-2 text-sm">Density Level</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-300 rounded border border-red-400"></div>
                  <span className="text-xs text-red-300">Low (0-39%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-400 rounded border border-red-500"></div>
                  <span className="text-xs text-red-300">Moderate (40-59%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded border border-red-600"></div>
                  <span className="text-xs text-red-300">High (60-79%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-600 rounded border border-red-700 shadow-lg shadow-red-900/50"></div>
                  <span className="text-xs text-red-300">Critical (80-100%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Zone Details Table */}
        <div className="bg-gradient-to-br from-black via-red-950/20 to-black border-2 border-red-600/50 rounded-xl p-6 shadow-xl shadow-red-900/40">
          <h3 className="text-xl font-bold text-red-500 mb-4 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-red-600" />
            Zone Details
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-red-600/50">
                  <th className="pb-3 text-red-400 font-semibold">Zone Name</th>
                  <th className="pb-3 text-red-400 font-semibold">Density</th>
                  <th className="pb-3 text-red-400 font-semibold">Status</th>
                  <th className="pb-3 text-red-400 font-semibold">Capacity</th>
                  <th className="pb-3 text-red-400 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {heatmapData.sort((a, b) => b.density - a.density).map((zone, index) => (
                  <tr key={zone.id} className="border-b border-red-950/50 hover:bg-red-950/30 transition-colors">
                    <td className="py-4 text-red-300 font-semibold">{zone.name}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-red-950 rounded-full h-2 border border-red-900">
                          <div
                            className={`h-2 rounded-full ${getDensityColor(zone.density)}`}
                            style={{ width: `${zone.density}%` }}
                          ></div>
                        </div>
                        <span className="text-red-300 font-bold">{zone.density}%</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        zone.density >= 80 ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-900/50' :
                        zone.density >= 60 ? 'bg-red-500 text-white border-red-400' :
                        zone.density >= 40 ? 'bg-red-400 text-white border-red-300' :
                        'bg-red-300 text-black border-red-200'
                      }`}>
                        {getDensityLabel(zone.density)}
                      </span>
                    </td>
                    <td className="py-4 text-red-300">
                      {Math.floor((zone.density / 100) * 2000)}/2000
                    </td>
                    <td className="py-4">
                      <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-all shadow-lg shadow-red-900/50 border border-red-500">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Custom Slider Styles */}
      <style jsx>{`
        .slider-red::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: #dc2626;
          cursor: pointer;
          border-radius: 50%;
          border: 2px solid #ef4444;
          box-shadow: 0 0 15px rgba(220, 38, 38, 0.8);
        }

        .slider-red::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #dc2626;
          cursor: pointer;
          border-radius: 50%;
          border: 2px solid #ef4444;
          box-shadow: 0 0 15px rgba(220, 38, 38, 0.8);
        }

        .slider-red::-webkit-slider-thumb:hover {
          background: #ef4444;
          transform: scale(1.15);
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.9);
        }

        .slider-red::-moz-range-thumb:hover {
          background: #ef4444;
          transform: scale(1.15);
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.9);
        }
      `}</style>
    </div>
  );
};

export default HeatmapPage;