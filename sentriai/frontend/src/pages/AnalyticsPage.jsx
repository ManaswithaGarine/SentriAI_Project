import React, { useState } from 'react';
import { 
  TrendingUp,
  TrendingDown,
  Users,
  AlertTriangle,
  Clock,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart as RechartsPie, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('today');

  // Sample data for charts
  const crowdTrendData = [
    { time: '09:00', count: 450 },
    { time: '10:00', count: 1200 },
    { time: '11:00', count: 2800 },
    { time: '12:00', count: 4500 },
    { time: '13:00', count: 6200 },
    { time: '14:00', count: 8900 },
    { time: '15:00', count: 11200 },
    { time: '16:00', count: 12450 },
  ];

  const incidentTypeData = [
    { name: 'Overcrowding', value: 45, color: '#ef4444' },
    { name: 'Medical', value: 23, color: '#f97316' },
    { name: 'Suspicious Activity', value: 15, color: '#eab308' },
    { name: 'Lost Person', value: 12, color: '#3b82f6' },
    { name: 'Other', value: 5, color: '#8b5cf6' }
  ];

  const responseTimeData = [
    { hour: '09:00', avgTime: 2.5 },
    { hour: '10:00', avgTime: 2.8 },
    { hour: '11:00', avgTime: 3.2 },
    { hour: '12:00', avgTime: 3.5 },
    { hour: '13:00', avgTime: 3.1 },
    { hour: '14:00', avgTime: 2.9 },
    { hour: '15:00', avgTime: 3.3 },
    { hour: '16:00', avgTime: 3.2 }
  ];

  const zoneDensityData = [
    { zone: 'Main Stage', density: 92 },
    { zone: 'Food Court', density: 78 },
    { zone: 'Entrance A', density: 65 },
    { zone: 'Exit B', density: 58 },
    { zone: 'Parking', density: 45 },
    { zone: 'Restrooms', density: 38 }
  ];

  const stats = [
    {
      title: 'Total Incidents',
      value: '127',
      change: '+12%',
      trend: 'up',
      icon: AlertTriangle,
      color: 'red',
      description: 'vs last event'
    },
    {
      title: 'Avg Response Time',
      value: '3.2 min',
      change: '-8%',
      trend: 'down',
      icon: Clock,
      color: 'green',
      description: 'improvement'
    },
    {
      title: 'Peak Attendance',
      value: '12,450',
      change: '+15%',
      trend: 'up',
      icon: Users,
      color: 'blue',
      description: 'record high'
    },
    {
      title: 'Resolution Rate',
      value: '94.7%',
      change: '+5%',
      trend: 'up',
      icon: Target,
      color: 'purple',
      description: 'efficiency'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      red: 'bg-red-900/20 border-red-700 text-red-400',
      green: 'bg-green-900/20 border-green-700 text-green-400',
      blue: 'bg-blue-900/20 border-blue-700 text-blue-400',
      purple: 'bg-purple-900/20 border-purple-700 text-purple-400'
    };
    return colors[color] || colors.blue;
  };

  const getIconBg = (color) => {
    const colors = {
      red: 'bg-red-900/30',
      green: 'bg-green-900/30',
      blue: 'bg-blue-900/30',
      purple: 'bg-purple-900/30'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-cyan-400" />
            Analytics Dashboard
          </h1>
          <p className="text-slate-400">Comprehensive insights and performance metrics</p>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex gap-2">
          {['today', 'week', 'month'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                timeRange === range
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-900/50'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600 border border-slate-600'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          const isPositive = stat.trend === 'up' && stat.color === 'green' || stat.trend === 'down' && stat.color === 'green';
          
          return (
            <div key={idx} className={`bg-slate-800 rounded-lg shadow-xl p-6 border-l-4 ${getColorClasses(stat.color)} border`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`p-3 rounded-lg ${getIconBg(stat.color)}`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-400`} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${
                  isPositive ? 'text-green-400' : 'text-red-400'
                }`}>
                  {isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  {stat.change}
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-slate-300">{stat.title}</div>
              <div className="text-xs text-slate-500 mt-2">{stat.description}</div>
            </div>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Crowd Trend */}
        <div className="bg-slate-800 rounded-lg shadow-xl p-6 border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            Crowd Attendance Trend
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={crowdTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="time" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#3b82f6" 
                strokeWidth={3}
                name="Attendees"
                dot={{ fill: '#3b82f6', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Incident Types */}
        <div className="bg-slate-800 rounded-lg shadow-xl p-6 border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-purple-400" />
            Incident Distribution
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <RechartsPie>
              <Pie
                data={incidentTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {incidentTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
            </RechartsPie>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Response Time */}
        <div className="bg-slate-800 rounded-lg shadow-xl p-6 border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-green-400" />
            Average Response Time
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={responseTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="hour" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="avgTime" 
                stroke="#10b981" 
                strokeWidth={3}
                name="Minutes"
                dot={{ fill: '#10b981', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Zone Density */}
        <div className="bg-slate-800 rounded-lg shadow-xl p-6 border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-orange-400" />
            Zone Density Analysis
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={zoneDensityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="zone" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Legend />
              <Bar dataKey="density" fill="#f97316" name="Density %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-gradient-to-r from-blue-900 via-cyan-900 to-blue-900 rounded-lg shadow-2xl p-8 text-white border border-blue-800">
        <div className="flex items-center gap-3 mb-6">
          <Award className="w-8 h-8 text-cyan-400" />
          <h3 className="text-2xl font-bold">Performance Summary</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur border border-white/20">
            <div className="text-3xl font-bold mb-2 text-cyan-300">94.7%</div>
            <div className="text-sm text-blue-200">Incident Resolution Rate</div>
            <div className="mt-2 text-xs text-blue-300">Above industry standard</div>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur border border-white/20">
            <div className="text-3xl font-bold mb-2 text-cyan-300">3.2 min</div>
            <div className="text-sm text-blue-200">Average Response Time</div>
            <div className="mt-2 text-xs text-blue-300">8% faster than target</div>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur border border-white/20">
            <div className="text-3xl font-bold mb-2 text-cyan-300">23/24</div>
            <div className="text-sm text-blue-200">Camera Uptime</div>
            <div className="mt-2 text-xs text-blue-300">96% operational</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;