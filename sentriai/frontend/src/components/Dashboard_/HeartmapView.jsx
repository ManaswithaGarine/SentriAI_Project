import React, { useState, useEffect, useRef } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Clock,
  MapPin,
  Activity,
  AlertCircle,
  Maximize2,
  Download
} from 'lucide-react';

const HeatmapView = () => {
  const canvasRef = useRef(null);
  const [heatmapData, setHeatmapData] = useState([]);
  const [timeRange, setTimeRange] = useState('live');
  const [selectedZone, setSelectedZone] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [densityThreshold, setDensityThreshold] = useState(70);

  // Grid dimensions
  const GRID_WIDTH = 20;
  const GRID_HEIGHT = 15;
  const CELL_SIZE = 40;

  // Initialize heatmap data
  useEffect(() => {
    generateHeatmapData();

    // Update heatmap every 2 seconds for live view
    const interval = setInterval(() => {
      if (timeRange === 'live') {
        updateHeatmapData();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [timeRange]);

  // Draw heatmap on canvas
  useEffect(() => {
    drawHeatmap();
  }, [heatmapData, densityThreshold]);

  const generateHeatmapData = () => {
    const data = [];
    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        // Create hotspots at specific locations
        let density = Math.random() * 30;
        
        // Main stage area (top center) - high density
        if (x >= 8 && x <= 12 && y >= 2 && y <= 5) {
          density = 70 + Math.random() * 25;
        }
        // Food court (left middle) - medium density
        else if (x >= 2 && x <= 5 && y >= 6 && y <= 9) {
          density = 45 + Math.random() * 20;
        }
        // Exit area (bottom right) - high density
        else if (x >= 15 && x <= 18 && y >= 11 && y <= 13) {
          density = 60 + Math.random() * 30;
        }
        // Entrance (top left)
        else if (x >= 1 && x <= 3 && y >= 1 && y <= 3) {
          density = 50 + Math.random() * 20;
        }

        data.push({
          x,
          y,
          density: Math.min(100, density),
          trend: 'stable',
          peopleCount: Math.floor(density * 5)
        });
      }
    }
    setHeatmapData(data);
  };

  const updateHeatmapData = () => {
    setHeatmapData(prevData => 
      prevData.map(cell => {
        const change = (Math.random() - 0.5) * 15;
        const newDensity = Math.max(0, Math.min(100, cell.density + change));
        
        let trend = 'stable';
        if (newDensity > cell.density + 5) trend = 'increasing';
        else if (newDensity < cell.density - 5) trend = 'decreasing';

        return {
          ...cell,
          density: newDensity,
          trend,
          peopleCount: Math.floor(newDensity * 5)
        };
      })
    );
  };

  const getDensityColor = (density) => {
    if (density < 30) return { r: 34, g: 197, b: 94 };     // Green
    if (density < 50) return { r: 234, g: 179, b: 8 };     // Yellow
    if (density < 70) return { r: 249, g: 115, b: 22 };    // Orange
    if (density < 85) return { r: 239, g: 68, b: 68 };     // Red
    return { r: 153, g: 27, b: 27 };                       // Dark Red
  };

  const drawHeatmap = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = GRID_WIDTH * CELL_SIZE;
    const height = GRID_HEIGHT * CELL_SIZE;

    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw cells
    heatmapData.forEach(cell => {
      const x = cell.x * CELL_SIZE;
      const y = cell.y * CELL_SIZE;
      const color = getDensityColor(cell.density);

      // Fill cell with color
      ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${0.3 + cell.density / 150})`;
      ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);

      // Draw border
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);

      // Highlight high-density areas
      if (cell.density > densityThreshold) {
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 2;
        ctx.strokeRect(x + 1, y + 1, CELL_SIZE - 2, CELL_SIZE - 2);
      }
    });

    // Draw labels for key areas
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('MAIN STAGE', 9 * CELL_SIZE, 4 * CELL_SIZE);
    ctx.fillText('FOOD COURT', 2 * CELL_SIZE, 8 * CELL_SIZE);
    ctx.fillText('EXIT', 16 * CELL_SIZE, 12 * CELL_SIZE);
    ctx.fillText('ENTRANCE', 1 * CELL_SIZE, 2 * CELL_SIZE);
  };

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
    const y = Math.floor((e.clientY - rect.top) / CELL_SIZE);

    const cell = heatmapData.find(c => c.x === x && c.y === y);
    if (cell) {
      setSelectedZone(cell);
    }
  };

  const getHighRiskZones = () => {
    return heatmapData.filter(cell => cell.density > densityThreshold).length;
  };

  const getAverageDensity = () => {
    const sum = heatmapData.reduce((acc, cell) => acc + cell.density, 0);
    return (sum / heatmapData.length).toFixed(1);
  };

  const getTotalPeople = () => {
    return heatmapData.reduce((acc, cell) => acc + cell.peopleCount, 0);
  };

  const downloadHeatmap = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `heatmap_${new Date().toISOString()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const getTrendIcon = (trend) => {
    if (trend === 'increasing') return <TrendingUp className="w-4 h-4 text-red-500" />;
    if (trend === 'decreasing') return <TrendingDown className="w-4 h-4 text-green-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Crowd Density Heatmap</h2>
          <p className="text-sm text-gray-600 mt-1">Real-time visualization of crowd movement patterns</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={downloadHeatmap}
            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mb-4 flex-wrap items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange('live')}
            className={`px-4 py-2 rounded ${
              timeRange === 'live'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Live
          </button>
          <button
            onClick={() => setTimeRange('last_hour')}
            className={`px-4 py-2 rounded ${
              timeRange === 'last_hour'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Last Hour
          </button>
          <button
            onClick={() => setTimeRange('last_day')}
            className={`px-4 py-2 rounded ${
              timeRange === 'last_day'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Last Day
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Alert Threshold:</label>
          <input
            type="range"
            min="50"
            max="90"
            value={densityThreshold}
            onChange={(e) => setDensityThreshold(Number(e.target.value))}
            className="w-32"
          />
          <span className="text-sm font-semibold text-gray-700">{densityThreshold}%</span>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 text-blue-700 text-sm font-semibold mb-1">
            <Activity className="w-4 h-4" />
            Total People
          </div>
          <div className="text-2xl font-bold text-blue-600">{getTotalPeople().toLocaleString()}</div>
        </div>

        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 text-green-700 text-sm font-semibold mb-1">
            <TrendingUp className="w-4 h-4" />
            Avg Density
          </div>
          <div className="text-2xl font-bold text-green-600">{getAverageDensity()}%</div>
        </div>

        <div className="bg-red-50 p-3 rounded-lg border border-red-200">
          <div className="flex items-center gap-2 text-red-700 text-sm font-semibold mb-1">
            <AlertCircle className="w-4 h-4" />
            High Risk Zones
          </div>
          <div className="text-2xl font-bold text-red-600">{getHighRiskZones()}</div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 text-gray-700 text-sm font-semibold mb-1">
            <Clock className="w-4 h-4" />
            Updated
          </div>
          <div className="text-xl font-bold text-gray-600">Just now</div>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Heatmap Canvas */}
        <div className="flex-1">
          <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50 inline-block">
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              className="cursor-crosshair"
              style={{ display: 'block' }}
            />
          </div>

          {/* Legend */}
          <div className="mt-4 flex gap-4 items-center justify-center text-sm">
            <span className="font-semibold text-gray-700">Density Level:</span>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: 'rgb(34, 197, 94)' }}></div>
              <span>Low (&lt;30%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: 'rgb(234, 179, 8)' }}></div>
              <span>Medium (30-50%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: 'rgb(249, 115, 22)' }}></div>
              <span>High (50-70%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: 'rgb(239, 68, 68)' }}></div>
              <span>Critical (70-85%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: 'rgb(153, 27, 27)' }}></div>
              <span>Extreme (&gt;85%)</span>
            </div>
          </div>
        </div>

        {/* Zone Details Panel */}
        {selectedZone && (
          <div className="w-80 bg-gray-50 rounded-lg p-4 border-2 border-blue-500">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-gray-800">Zone Details</h3>
              <button
                onClick={() => setSelectedZone(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                  <MapPin className="w-4 h-4" />
                  Location
                </div>
                <div className="text-lg font-semibold text-gray-800">
                  Grid [{selectedZone.x}, {selectedZone.y}]
                </div>
              </div>

              <div>
                <div className="text-gray-600 text-sm mb-1">Crowd Density</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                      className={`h-full ${
                        selectedZone.density < 30 ? 'bg-green-500' :
                        selectedZone.density < 50 ? 'bg-yellow-500' :
                        selectedZone.density < 70 ? 'bg-orange-500' :
                        selectedZone.density < 85 ? 'bg-red-500' :
                        'bg-red-800'
                      }`}
                      style={{ width: `${selectedZone.density}%` }}
                    ></div>
                  </div>
                  <span className="text-lg font-bold text-gray-800">{Math.round(selectedZone.density)}%</span>
                </div>
              </div>

              <div>
                <div className="text-gray-600 text-sm mb-1">Estimated People Count</div>
                <div className="text-2xl font-bold text-blue-600">{selectedZone.peopleCount}</div>
              </div>

              <div>
                <div className="text-gray-600 text-sm mb-1">Trend</div>
                <div className="flex items-center gap-2">
                  {getTrendIcon(selectedZone.trend)}
                  <span className="font-semibold text-gray-800 capitalize">{selectedZone.trend}</span>
                </div>
              </div>

              <div>
                <div className="text-gray-600 text-sm mb-1">Risk Level</div>
                <div className={`inline-block px-3 py-1 rounded-full font-semibold ${
                  selectedZone.density < 30 ? 'bg-green-100 text-green-700' :
                  selectedZone.density < 50 ? 'bg-yellow-100 text-yellow-700' :
                  selectedZone.density < 70 ? 'bg-orange-100 text-orange-700' :
                  selectedZone.density < 85 ? 'bg-red-100 text-red-700' :
                  'bg-red-200 text-red-900'
                }`}>
                  {selectedZone.density < 30 ? 'Safe' :
                   selectedZone.density < 50 ? 'Moderate' :
                   selectedZone.density < 70 ? 'Elevated' :
                   selectedZone.density < 85 ? 'High Risk' :
                   'Critical'}
                </div>
              </div>

              {selectedZone.density > densityThreshold && (
                <div className="bg-red-50 border border-red-300 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-red-700 font-semibold mb-2">
                    <AlertCircle className="w-5 h-5" />
                    Action Required
                  </div>
                  <p className="text-sm text-red-600">
                    This zone has exceeded the alert threshold. Consider deploying crowd control measures.
                  </p>
                  <button className="mt-3 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 font-semibold">
                    Dispatch Response Team
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Movement Pattern Analysis */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">Hotspots Detected</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Main Stage Area (95% capacity)</li>
            <li>• Exit Zone B (78% capacity)</li>
            <li>• Food Court (62% capacity)</li>
          </ul>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-900 mb-2">Flow Patterns</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• North to South: Moderate flow</li>
            <li>• Stage to Exits: High flow</li>
            <li>• Entrance to Stage: Steady</li>
          </ul>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <h4 className="font-semibold text-orange-900 mb-2">Recommendations</h4>
          <ul className="text-sm text-orange-700 space-y-1">
            <li>• Open additional exit points</li>
            <li>• Deploy crowd control at stage</li>
            <li>• Monitor food court closely</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HeatmapView;