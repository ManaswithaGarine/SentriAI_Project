import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Clock,
  MapPin,
  Users,
  Camera,
  Shield,
  Bell,
  Filter,
  Search,
  ChevronDown,
  X,
  Eye,
  CheckCircle,
  XCircle
} from 'lucide-react';

const AlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  useEffect(() => {
    const sampleAlerts = [
      {
        id: 1,
        type: 'critical',
        title: 'Critical Overcrowding Detected',
        location: 'Main Stage Area - Zone A',
        description: 'Crowd density has exceeded safe capacity limits. Immediate intervention required.',
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        status: 'active',
        camera: 'CAM-001',
        attendees: 2500,
        capacity: 2000,
        responders: 3
      },
      {
        id: 2,
        type: 'warning',
        title: 'High Crowd Density',
        location: 'Exit Gate B',
        description: 'Approaching maximum capacity. Monitor closely for congestion.',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        status: 'active',
        camera: 'CAM-015',
        attendees: 1800,
        capacity: 2000,
        responders: 2
      },
      {
        id: 3,
        type: 'critical',
        title: 'Unusual Crowd Movement',
        location: 'Food Court - Section C',
        description: 'Rapid crowd movement detected. Possible panic situation.',
        timestamp: new Date(Date.now() - 8 * 60 * 1000),
        status: 'investigating',
        camera: 'CAM-023',
        attendees: 1200,
        capacity: 1500,
        responders: 4
      },
      {
        id: 4,
        type: 'warning',
        title: 'Camera Blind Spot',
        location: 'Parking Lot - West Wing',
        description: 'Multiple cameras offline creating blind spot in coverage.',
        timestamp: new Date(Date.now() - 12 * 60 * 1000),
        status: 'active',
        camera: 'CAM-045, CAM-046',
        attendees: 'N/A',
        capacity: 'N/A',
        responders: 1
      },
      {
        id: 5,
        type: 'info',
        title: 'Moderate Crowd Buildup',
        location: 'Merchandise Booth',
        description: 'Crowd forming at popular merchandise location. No immediate concern.',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        status: 'monitoring',
        camera: 'CAM-012',
        attendees: 800,
        capacity: 1000,
        responders: 1
      },
      {
        id: 6,
        type: 'resolved',
        title: 'Medical Emergency Response',
        location: 'VIP Section',
        description: 'Medical team dispatched and situation handled successfully.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        status: 'resolved',
        camera: 'CAM-008',
        attendees: 450,
        capacity: 500,
        responders: 0
      }
    ];
    setAlerts(sampleAlerts);
  }, []);

  const getAlertColor = (type) => {
    switch (type) {
      case 'critical':
        return 'border-red-600 bg-red-900/20';
      case 'warning':
        return 'border-orange-500 bg-orange-900/20';
      case 'info':
        return 'border-blue-500 bg-blue-900/20';
      case 'resolved':
        return 'border-green-500 bg-green-900/20';
      default:
        return 'border-gray-600 bg-gray-800';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="w-6 h-6 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-orange-500" />;
      case 'info':
        return <Bell className="w-6 h-6 text-blue-500" />;
      case 'resolved':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      default:
        return <Bell className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return (
          <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full flex items-center gap-1">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            ACTIVE
          </span>
        );
      case 'investigating':
        return (
          <span className="px-3 py-1 bg-orange-600 text-white text-xs font-bold rounded-full">
            INVESTIGATING
          </span>
        );
      case 'monitoring':
        return (
          <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
            MONITORING
          </span>
        );
      case 'resolved':
        return (
          <span className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full">
            RESOLVED
          </span>
        );
      default:
        return null;
    }
  };

  const formatTime = (date) => {
    const diffMins = Math.floor((new Date() - date) / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours}h ago`;
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesFilter = filterType === 'all' || alert.type === filterType;
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const alertStats = {
    critical: alerts.filter(a => a.type === 'critical').length,
    warning: alerts.filter(a => a.type === 'warning').length,
    info: alerts.filter(a => a.type === 'info').length,
    resolved: alerts.filter(a => a.type === 'resolved').length
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Anomaly Alerts</h1>
          <p className="text-gray-400">Real-time monitoring and alert management system</p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 border-2 border-red-900/30 rounded-xl p-4 hover:border-red-700 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Critical</p>
                <p className="text-3xl font-bold text-red-500">{alertStats.critical}</p>
              </div>
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
          </div>

          <div className="bg-gray-900 border-2 border-red-900/30 rounded-xl p-4 hover:border-orange-600 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Warning</p>
                <p className="text-3xl font-bold text-orange-500">{alertStats.warning}</p>
              </div>
              <AlertTriangle className="w-10 h-10 text-orange-500" />
            </div>
          </div>

          <div className="bg-gray-900 border-2 border-red-900/30 rounded-xl p-4 hover:border-blue-600 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Info</p>
                <p className="text-3xl font-bold text-blue-500">{alertStats.info}</p>
              </div>
              <Bell className="w-10 h-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-gray-900 border-2 border-red-900/30 rounded-xl p-4 hover:border-green-600 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Resolved</p>
                <p className="text-3xl font-bold text-green-500">{alertStats.resolved}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-gray-900 border-2 border-red-900/30 rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search alerts by title or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 text-white border-2 border-gray-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-red-600 transition-colors"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 border-2 border-gray-700 rounded-lg text-white hover:border-red-600 transition-colors"
            >
              <Filter className="w-5 h-5" />
              <span className="capitalize">{filterType}</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {showFilterMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 border-2 border-red-900/30 rounded-lg shadow-2xl z-10">
                {['all', 'critical', 'warning', 'info', 'resolved'].map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setFilterType(type);
                      setShowFilterMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 transition-colors capitalize first:rounded-t-lg last:rounded-b-lg"
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-gray-900 border-2 ${getAlertColor(alert.type)} rounded-xl p-6 hover:shadow-2xl transition-all`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{alert.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {alert.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatTime(alert.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
                {getStatusBadge(alert.status)}
              </div>

              <p className="text-gray-300 mb-4">{alert.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Camera className="w-4 h-4 text-red-400" />
                  <span className="text-gray-400">{alert.camera}</span>
                </div>
                {alert.attendees !== 'N/A' && (
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-red-400" />
                    <span className="text-gray-400">{alert.attendees}/{alert.capacity}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4 text-red-400" />
                  <span className="text-gray-400">{alert.responders} Responders</span>
                </div>
              </div>

              <div className="flex gap-2">
               <button className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
                {alert.status === 'active' && (
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                    <CheckCircle className="w-4 h-4" />
                    Mark as Resolved
                  </button>
                )}
                {alert.status === 'resolved' && (
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                    <X className="w-4 h-4" />
                    Dismiss
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredAlerts.length === 0 && (
          <div className="bg-gray-900 border-2 border-red-900/30 rounded-xl p-12 text-center">
            <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400 mb-2">No Alerts Found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search criteria' : 'All systems operating normally'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsPage;