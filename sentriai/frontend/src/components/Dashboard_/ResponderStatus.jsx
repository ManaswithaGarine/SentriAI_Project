import React, { useState, useEffect } from 'react';
import { 
  User,
  MapPin,
  Clock,
  Phone,
  Radio,
  CheckCircle,
  AlertCircle,
  Activity,
  Navigation,
  MessageSquare,
  Shield,
  Ambulance,
  Flame,
  Users,
  Battery,
  Signal
} from 'lucide-react';

const ResponderStatus = () => {
  const [responders, setResponders] = useState([]);
  const [selectedResponder, setSelectedResponder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('status');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Responder types with icons
  const responderTypes = {
    security: { icon: Shield, color: 'red-500', label: 'Security Team' },
    medical: { icon: Ambulance, color: 'red-600', label: 'Medical Team' },
    fire: { icon: Flame, color: 'red-700', label: 'Fire Team' },
    crowd_control: { icon: Users, color: 'red-400', label: 'Crowd Control Team' }
  };

  // Status configurations
  const statusConfig = {
    available: { 
      color: 'green', 
      bg: 'bg-red-950/30', 
      border: 'border-red-700',
      text: 'text-red-300',
      label: 'Available',
      icon: CheckCircle
    },
    on_duty: { 
      color: 'blue', 
      bg: 'bg-red-950/40', 
      border: 'border-red-600',
      text: 'text-red-400',
      label: 'On Duty',
      icon: Activity
    },
    responding: { 
      color: 'orange', 
      bg: 'bg-red-900/50', 
      border: 'border-red-500',
      text: 'text-red-200',
      label: 'Responding',
      icon: Navigation
    },
    busy: { 
      color: 'red', 
      bg: 'bg-red-900/60', 
      border: 'border-red-400',
      text: 'text-red-100',
      label: 'Busy',
      icon: AlertCircle
    },
    off_duty: { 
      color: 'gray', 
      bg: 'bg-black/50', 
      border: 'border-red-900',
      text: 'text-red-500',
      label: 'Off Duty',
      icon: Clock
    }
  };

  // Initialize responders data with YOUR TEAM
  useEffect(() => {
    const initialResponders = [
      {
        id: 'MED-001',
        name: 'Manaswitha',
        type: 'medical',
        status: 'available',
        location: 'Medical Center - Main',
        coordinates: { lat: 17.385, lng: 78.486 },
        assignedIncident: null,
        lastUpdate: new Date(),
        phone: '+91-9014721672',
        battery: 85,
        signal: 5,
        responseTime: '2 min',
        completedTasks: 12
      },
      {
        id: 'FIRE-001',
        name: 'Thanusiya',
        type: 'fire',
        status: 'responding',
        location: 'Main Stage Area',
        coordinates: { lat: 17.387, lng: 78.488 },
        assignedIncident: 'INC-045',
        incidentType: 'Fire Safety Check',
        lastUpdate: new Date(),
        phone: '+91-9618775125',
        battery: 72,
        signal: 4,
        responseTime: '3 min',
        completedTasks: 8,
        eta: '4 mins'
      },
      {
        id: 'CWD-001',
        name: 'Latika',
        type: 'crowd_control',
        status: 'busy',
        location: 'Main Stage - Section B',
        coordinates: { lat: 17.389, lng: 78.490 },
        assignedIncident: 'INC-043',
        incidentType: 'Crowd Density Alert',
        lastUpdate: new Date(),
        phone: '+91-7601062419',
        battery: 65,
        signal: 5,
        responseTime: '2 min',
        completedTasks: 15
      },
      {
        id: 'SEC-001',
        name: 'Kevna',
        type: 'security',
        status: 'on_duty',
        location: 'Main Gate A',
        coordinates: { lat: 17.383, lng: 78.484 },
        assignedIncident: null,
        lastUpdate: new Date(),
        phone: '+91-8500111654',
        battery: 92,
        signal: 5,
        responseTime: '1 min',
        completedTasks: 18
      }
    ];

    setResponders(initialResponders);

    // Real-time clock update
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Simulate real-time updates - battery drain, signal changes, location updates
    const updateInterval = setInterval(() => {
      setResponders(prev => prev.map(responder => {
        const newBattery = Math.max(10, responder.battery - Math.random() * 0.5);
        const newSignal = Math.min(5, Math.max(1, responder.signal + (Math.random() - 0.5)));
        
        return {
          ...responder,
          lastUpdate: new Date(),
          battery: newBattery,
          signal: Math.round(newSignal)
        };
      }));
    }, 5000);

    // Simulate status changes occasionally
    const statusInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setResponders(prev => {
          const randomIndex = Math.floor(Math.random() * prev.length);
          const updated = [...prev];
          const responder = updated[randomIndex];
          
          // Random status change
          if (responder.status === 'available' && Math.random() > 0.5) {
            updated[randomIndex] = {
              ...responder,
              status: 'responding',
              assignedIncident: `INC-${Math.floor(Math.random() * 100)}`,
              incidentType: ['Medical Emergency', 'Fire Check', 'Crowd Alert', 'Security Issue'][Math.floor(Math.random() * 4)]
            };
          } else if (responder.status === 'responding' && Math.random() > 0.5) {
            updated[randomIndex] = {
              ...responder,
              status: 'available',
              assignedIncident: null,
              incidentType: null,
              completedTasks: responder.completedTasks + 1
            };
          }
          
          return updated;
        });
      }
    }, 15000);

    return () => {
      clearInterval(clockInterval);
      clearInterval(updateInterval);
      clearInterval(statusInterval);
    };
  }, []);

  // Format time ago
  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    
    if (diffSecs < 60) return `${diffSecs}s ago`;
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours}h ago`;
  };

  // Handle dispatch
  const handleDispatch = (responderId, incidentId = 'INC-NEW') => {
    setResponders(prev => prev.map(r => 
      r.id === responderId 
        ? { ...r, status: 'responding', assignedIncident: incidentId, incidentType: 'Emergency Response', eta: '5 mins' }
        : r
    ));
  };

  // Handle recall
  const handleRecall = (responderId) => {
    setResponders(prev => prev.map(r => 
      r.id === responderId 
        ? { ...r, status: 'available', assignedIncident: null, incidentType: null, eta: null, completedTasks: r.completedTasks + 1 }
        : r
    ));
  };

  // Handle contact - Opens phone dialer
  const handleContact = (responder) => {
    window.location.href = `tel:${responder.phone}`;
  };

  // Filter and sort responders
  const filteredResponders = responders
    .filter(r => filterStatus === 'all' || r.status === filterStatus)
    .filter(r => filterType === 'all' || r.type === filterType)
    .sort((a, b) => {
      if (sortBy === 'status') {
        const statusOrder = ['responding', 'busy', 'on_duty', 'available', 'off_duty'];
        return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
      }
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'type') return a.type.localeCompare(b.type);
      return 0;
    });

  // Get statistics
  const stats = {
    total: responders.length,
    available: responders.filter(r => r.status === 'available').length,
    responding: responders.filter(r => r.status === 'responding').length,
    busy: responders.filter(r => r.status === 'busy').length,
    offDuty: responders.filter(r => r.status === 'off_duty').length
  };

  return (
    <div className="bg-gradient-to-br from-black via-red-950/20 to-black rounded-lg shadow-2xl shadow-red-900/50 p-6 h-full border-2 border-red-600/50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-red-500">Responder Status</h2>
          <p className="text-sm text-red-300/70 mt-1">Real-time tracking and management</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-2 border border-red-500 shadow-lg shadow-red-900/50 transition-all">
            <Radio className="w-4 h-4" />
            Broadcast
          </button>
          <button className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800 flex items-center gap-2 border border-red-600 shadow-lg shadow-red-900/50 transition-all">
            <MessageSquare className="w-4 h-4" />
            Message All
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-gradient-to-br from-black to-red-950/30 p-4 rounded-lg border-2 border-red-600/50 shadow-lg shadow-red-900/30">
          <div className="text-red-400 text-sm font-semibold mb-1">Total Staff</div>
          <div className="text-3xl font-bold text-red-300">{stats.total}</div>
        </div>
        <div className="bg-gradient-to-br from-black to-red-950/30 p-4 rounded-lg border-2 border-red-600/50 shadow-lg shadow-red-900/30">
          <div className="text-red-400 text-sm font-semibold mb-1">Available</div>
          <div className="text-3xl font-bold text-red-300">{stats.available}</div>
        </div>
        <div className="bg-gradient-to-br from-black to-red-950/30 p-4 rounded-lg border-2 border-red-600/50 shadow-lg shadow-red-900/30">
          <div className="text-red-400 text-sm font-semibold mb-1">Responding</div>
          <div className="text-3xl font-bold text-red-400">{stats.responding}</div>
        </div>
        <div className="bg-gradient-to-br from-black to-red-950/30 p-4 rounded-lg border-2 border-red-600/50 shadow-lg shadow-red-900/30">
          <div className="text-red-400 text-sm font-semibold mb-1">Busy</div>
          <div className="text-3xl font-bold text-red-500 animate-pulse">{stats.busy}</div>
        </div>
        <div className="bg-gradient-to-br from-black to-red-950/30 p-4 rounded-lg border-2 border-red-600/50 shadow-lg shadow-red-900/30">
          <div className="text-red-400 text-sm font-semibold mb-1">Off Duty</div>
          <div className="text-3xl font-bold text-red-300">{stats.offDuty}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <div className="flex gap-2 items-center">
          <label className="text-sm font-semibold text-red-400">Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-black border-2 border-red-600/50 text-red-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="responding">Responding</option>
            <option value="busy">Busy</option>
            <option value="on_duty">On Duty</option>
            <option value="off_duty">Off Duty</option>
          </select>
        </div>

        <div className="flex gap-2 items-center">
          <label className="text-sm font-semibold text-red-400">Type:</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 bg-black border-2 border-red-600/50 text-red-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="all">All Types</option>
            <option value="security">Security</option>
            <option value="medical">Medical</option>
            <option value="fire">Fire Safety</option>
            <option value="crowd_control">Crowd Control</option>
          </select>
        </div>

        <div className="flex gap-2 items-center">
          <label className="text-sm font-semibold text-red-400">Sort:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-black border-2 border-red-600/50 text-red-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="status">By Status</option>
            <option value="name">By Name</option>
            <option value="type">By Type</option>
          </select>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Responders List */}
        <div className="flex-1 space-y-3 max-h-[600px] overflow-y-auto pr-2">
          {filteredResponders.map(responder => {
            const TypeIcon = responderTypes[responder.type].icon;
            const StatusIcon = statusConfig[responder.status].icon;
            const statusInfo = statusConfig[responder.status];

            return (
              <div
                key={responder.id}
                onClick={() => setSelectedResponder(responder)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all shadow-lg shadow-red-900/30 ${
                  selectedResponder?.id === responder.id
                    ? 'border-red-500 bg-red-900/40 shadow-xl shadow-red-800/50'
                    : `${statusInfo.bg} ${statusInfo.border} hover:shadow-xl hover:shadow-red-800/40`
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full bg-red-950/50 border-2 border-${responderTypes[responder.type].color} flex items-center justify-center shadow-lg`}>
                      <TypeIcon className={`w-6 h-6 text-${responderTypes[responder.type].color}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-red-200 text-lg">{responder.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-red-400">
                        <span className="font-semibold">{responder.id}</span>
                        <span>•</span>
                        <span>{responderTypes[responder.type].label}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusInfo.bg} border-2 ${statusInfo.border} shadow-lg shadow-red-900/40`}>
                    <StatusIcon className={`w-4 h-4 ${statusInfo.text}`} />
                    <span className={`text-sm font-semibold ${statusInfo.text}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="flex items-center gap-2 text-sm text-red-300">
                    <MapPin className="w-4 h-4" />
                    <span>{responder.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-red-300">
                    <Clock className="w-4 h-4" />
                    <span>{formatTimeAgo(responder.lastUpdate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-red-300">
                    <Battery className={`w-4 h-4 ${responder.battery < 30 ? 'text-red-600 animate-pulse' : ''}`} />
                    <span>{Math.round(responder.battery)}%</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-red-300">
                    <Signal className="w-4 h-4" />
                    <span>{'●'.repeat(Math.round(responder.signal))}{'○'.repeat(5 - Math.round(responder.signal))}</span>
                  </div>
                </div>

                {responder.assignedIncident && (
                  <div className="bg-red-950/50 rounded p-2 mb-3 border-2 border-red-500 shadow-lg shadow-red-900/50 animate-pulse">
                    <div className="flex items-center gap-2 text-sm">
                      <AlertCircle className="w-4 h-4 text-red-400" />
                      <span className="font-semibold text-red-200">
                        {responder.assignedIncident}: {responder.incidentType}
                      </span>
                    </div>
                    {responder.eta && (
                      <div className="text-xs text-red-300 mt-1">ETA: {responder.eta}</div>
                    )}
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleContact(responder);
                    }}
                    className="flex-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-semibold flex items-center justify-center gap-2 border border-red-500 shadow-lg shadow-red-900/50 transition-all"
                  >
                    <Phone className="w-4 h-4" />
                    Call
                  </button>
                  {responder.status === 'available' ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDispatch(responder.id);
                      }}
                      className="flex-1 px-3 py-2 bg-red-700 text-white rounded hover:bg-red-800 text-sm font-semibold flex items-center justify-center gap-2 border border-red-600 shadow-lg shadow-red-900/50 transition-all"
                    >
                      <Navigation className="w-4 h-4" />
                      Dispatch
                    </button>
                  ) : responder.status === 'responding' || responder.status === 'busy' ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRecall(responder.id);
                      }}
                      className="flex-1 px-3 py-2 bg-red-800 text-white rounded hover:bg-red-900 text-sm font-semibold border border-red-700 shadow-lg shadow-red-900/50 transition-all"
                    >
                      Recall
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        {/* Details Panel */}
        {selectedResponder && (
          <div className="w-96 bg-gradient-to-br from-black to-red-950/30 rounded-lg p-4 border-2 border-red-500 shadow-2xl shadow-red-900/70">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-red-400">Responder Details</h3>
              <button
                onClick={() => setSelectedResponder(null)}
                className="text-red-400 hover:text-red-300 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="text-center pb-4 border-b-2 border-red-600/50">
                <div className={`w-20 h-20 mx-auto rounded-full bg-red-950/50 border-2 border-${responderTypes[selectedResponder.type].color} flex items-center justify-center mb-3 shadow-xl shadow-red-900/70`}>
                  {React.createElement(responderTypes[selectedResponder.type].icon, {
                    className: `w-10 h-10 text-${responderTypes[selectedResponder.type].color}`
                  })}
                </div>
                <h4 className="text-xl font-bold text-red-300">{selectedResponder.name}</h4>
                <p className="text-sm text-red-400">{selectedResponder.id}</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-red-500">Type</label>
                  <div className="text-lg font-semibold text-red-300">
                    {responderTypes[selectedResponder.type].label}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-red-500">Status</label>
                  <div className={`text-lg font-semibold ${statusConfig[selectedResponder.status].text}`}>
                    {statusConfig[selectedResponder.status].label}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-red-500">Current Location</label>
                  <div className="text-sm font-semibold text-red-300">{selectedResponder.location}</div>
                  <div className="text-xs text-red-400">
                    {selectedResponder.coordinates.lat.toFixed(3)}, {selectedResponder.coordinates.lng.toFixed(3)}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-red-500">Contact</label>
                  <div className="text-sm font-semibold text-red-300">{selectedResponder.phone}</div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-red-500">Average Response Time</label>
                  <div className="text-sm font-semibold text-red-300">{selectedResponder.responseTime}</div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-red-500">Tasks Completed Today</label>
                  <div className="text-sm font-semibold text-red-300">{selectedResponder.completedTasks}</div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-red-500">Device Status</label>
                  <div className="flex gap-4 mt-1">
                    <div className="flex items-center gap-2">
                      <Battery className={`w-4 h-4 ${selectedResponder.battery < 30 ? 'text-red-600 animate-pulse' : 'text-red-400'}`} />
                      <span className="text-sm font-semibold text-red-300">{Math.round(selectedResponder.battery)}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Signal className="w-4 h-4 text-red-400" />
                      <span className="text-sm font-semibold text-red-300">{Math.round(selectedResponder.signal)}/5</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-red-500">Last Update</label>
                  <div className="text-sm text-red-300">{formatTimeAgo(selectedResponder.lastUpdate)}</div>
                </div>
              </div>

              {selectedResponder.assignedIncident && (
                <div className="bg-red-900/50 border-2 border-red-500 rounded-lg p-3 shadow-xl shadow-red-900/70 animate-pulse">
                  <div className="font-semibold text-red-300 mb-2">Current Assignment</div>
                  <div className="text-sm text-red-200">
                    <div className="font-semibold">{selectedResponder.assignedIncident}</div>
                    <div>{selectedResponder.incidentType}</div>
                    {selectedResponder.eta && <div className="mt-1">ETA: {selectedResponder.eta}</div>}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => handleContact(selectedResponder)}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded hover:bg-red-700 font-semibold flex items-center justify-center gap-2 border border-red-500 shadow-lg shadow-red-900/50 transition-all"
                >
                  <Phone className="w-5 h-5" />
                  Call Now
                </button>
                <button
                  onClick={() => alert('Sending message...')}
                  className="px-4 py-3 bg-red-700 text-white rounded hover:bg-red-800 border border-red-600 shadow-lg shadow-red-900/50 transition-all"
                >
                  <MessageSquare className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponderStatus;