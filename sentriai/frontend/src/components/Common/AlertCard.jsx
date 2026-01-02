import React, { useState } from 'react';
import { 
  AlertTriangle,
  Users,
  Flame,
  UserX,
  Activity,
  X,
  MapPin,
  Clock,
  Camera,
  CheckCircle,
  Navigation,
  Phone,
  Eye,
  AlertCircle,
  TrendingUp,
  MessageSquare
} from 'lucide-react';

const AlertCard = ({ alert, onAcknowledge, onDismiss, onDispatch, onViewCamera }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [notes, setNotes] = useState('');

  // Alert type configurations
  const alertTypeConfig = {
    overcrowding: {
      icon: Users,
      color: 'red',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-300',
      textColor: 'text-red-700',
      iconColor: 'text-red-600',
      label: 'Overcrowding',
      priority: 'critical'
    },
    fight: {
      icon: UserX,
      color: 'orange',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-300',
      textColor: 'text-orange-700',
      iconColor: 'text-orange-600',
      label: 'Fight/Conflict',
      priority: 'high'
    },
    fire: {
      icon: Flame,
      color: 'red',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-300',
      textColor: 'text-red-700',
      iconColor: 'text-red-600',
      label: 'Fire Hazard',
      priority: 'critical'
    },
    unusual_activity: {
      icon: Activity,
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-300',
      textColor: 'text-yellow-700',
      iconColor: 'text-yellow-600',
      label: 'Unusual Activity',
      priority: 'medium'
    },
    panic: {
      icon: AlertTriangle,
      color: 'red',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-300',
      textColor: 'text-red-700',
      iconColor: 'text-red-600',
      label: 'Panic Detection',
      priority: 'critical'
    },
    medical: {
      icon: AlertCircle,
      color: 'purple',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-300',
      textColor: 'text-purple-700',
      iconColor: 'text-purple-600',
      label: 'Medical Emergency',
      priority: 'high'
    },
    blocked_exit: {
      icon: X,
      color: 'orange',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-300',
      textColor: 'text-orange-700',
      iconColor: 'text-orange-600',
      label: 'Blocked Exit',
      priority: 'critical'
    }
  };

  // Severity configurations
  const severityConfig = {
    critical: {
      color: 'bg-red-600',
      textColor: 'text-red-600',
      label: 'CRITICAL',
      pulse: true
    },
    high: {
      color: 'bg-orange-500',
      textColor: 'text-orange-500',
      label: 'HIGH',
      pulse: false
    },
    medium: {
      color: 'bg-yellow-500',
      textColor: 'text-yellow-500',
      label: 'MEDIUM',
      pulse: false
    },
    low: {
      color: 'bg-blue-500',
      textColor: 'text-blue-500',
      label: 'LOW',
      pulse: false
    }
  };

  // Status configurations
  const statusConfig = {
    active: {
      color: 'bg-red-600',
      textColor: 'text-red-700',
      label: 'Active'
    },
    acknowledged: {
      color: 'bg-blue-600',
      textColor: 'text-blue-700',
      label: 'Acknowledged'
    },
    responding: {
      color: 'bg-orange-600',
      textColor: 'text-orange-700',
      label: 'Responding'
    },
    resolved: {
      color: 'bg-green-600',
      textColor: 'text-green-700',
      label: 'Resolved'
    }
  };

  const config = alertTypeConfig[alert.type] || alertTypeConfig.unusual_activity;
  const AlertIcon = config.icon;
  const severity = severityConfig[alert.severity];
  const status = statusConfig[alert.status];

  // Format timestamp
  const formatTime = (date) => {
    const now = new Date();
    const alertTime = new Date(date);
    const diffMs = now - alertTime;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    
    if (diffSecs < 60) return `${diffSecs}s ago`;
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours}h ago`;
  };

  // Handle actions
  const handleAcknowledge = () => {
    if (onAcknowledge) onAcknowledge(alert.id);
  };

  const handleDismiss = () => {
    if (onDismiss) onDismiss(alert.id);
  };

  const handleDispatch = () => {
    if (onDispatch) onDispatch(alert.id);
  };

  const handleViewCamera = () => {
    if (onViewCamera) onViewCamera(alert.camera);
  };

  const handleAddNote = () => {
    if (notes.trim()) {
      alert.notes = alert.notes || [];
      alert.notes.push({
        text: notes,
        timestamp: new Date(),
        user: 'Current User'
      });
      setNotes('');
    }
  };

  return (
    <div 
      className={`${config.bgColor} border-2 ${config.borderColor} rounded-lg shadow-lg overflow-hidden transition-all ${
        severity.pulse && alert.status === 'active' ? 'animate-pulse' : ''
      }`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full ${config.bgColor} border-2 ${config.borderColor} flex items-center justify-center`}>
              <AlertIcon className={`w-6 h-6 ${config.iconColor}`} />
            </div>
            <div>
              <h3 className={`font-bold text-lg ${config.textColor}`}>{config.label}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-semibold text-gray-600">ID: {alert.id}</span>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-600 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTime(alert.timestamp)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 items-end">
            <div className={`${severity.color} text-white px-3 py-1 rounded-full text-xs font-bold`}>
              {severity.label}
            </div>
            <div className={`${status.color} text-white px-3 py-1 rounded-full text-xs font-bold`}>
              {status.label}
            </div>
          </div>
        </div>

        <div className="mb-3">
          <p className="text-gray-800 font-medium">{alert.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="font-semibold">{alert.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Camera className="w-4 h-4 flex-shrink-0" />
            <span className="font-semibold">{alert.camera}</span>
          </div>
        </div>

        {alert.crowdCount && (
          <div className="bg-white rounded-lg p-3 mb-3 border border-gray-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-semibold text-gray-700">Crowd Count:</span>
              </div>
              <span className="text-lg font-bold text-gray-900">{alert.crowdCount}</span>
            </div>
            {alert.densityLevel && (
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-semibold text-gray-700">Density Level:</span>
                <span className={`text-sm font-bold ${
                  alert.densityLevel > 80 ? 'text-red-600' :
                  alert.densityLevel > 60 ? 'text-orange-600' :
                  'text-yellow-600'
                }`}>
                  {alert.densityLevel}%
                </span>
              </div>
            )}
          </div>
        )}

        {alert.responderAssigned && (
          <div className="bg-blue-100 border border-blue-300 rounded-lg p-3 mb-3">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-blue-700" />
              <span className="text-sm font-semibold text-blue-900">
                Assigned to: {alert.responderAssigned}
              </span>
            </div>
            {alert.eta && (
              <div className="text-xs text-blue-700 mt-1">
                ETA: {alert.eta}
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2">
          {alert.status === 'active' && (
            <>
              <button
                onClick={handleAcknowledge}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-semibold text-sm flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Acknowledge
              </button>
              <button
                onClick={handleDispatch}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded font-semibold text-sm flex items-center justify-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                Dispatch
              </button>
            </>
          )}
          
          {alert.status === 'acknowledged' && (
            <button
              onClick={handleDispatch}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded font-semibold text-sm flex items-center justify-center gap-2"
            >
              <Navigation className="w-4 h-4" />
              Dispatch Team
            </button>
          )}

          <button
            onClick={handleViewCamera}
            className="bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded font-semibold text-sm flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            View
          </button>

          {alert.status !== 'resolved' && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded font-semibold text-sm"
            >
              {isExpanded ? '−' : '+'}
            </button>
          )}

          {alert.status === 'resolved' && (
            <button
              onClick={handleDismiss}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded font-semibold text-sm flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Dismiss
            </button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="border-t-2 border-gray-300 bg-white p-4">
          <div className="space-y-4">
            {alert.timeline && alert.timeline.length > 0 && (
              <div>
                <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Timeline
                </h4>
                <div className="space-y-2">
                  {alert.timeline.map((event, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                      <div>
                        <div className="text-gray-600">{formatTime(event.timestamp)}</div>
                        <div className="text-gray-800">{event.action}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Add Note
              </h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add incident notes..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddNote}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
                >
                  Add
                </button>
              </div>
            </div>

            {alert.notes && alert.notes.length > 0 && (
              <div>
                <h4 className="font-bold text-gray-800 mb-2">Notes</h4>
                <div className="space-y-2">
                  {alert.notes.map((note, idx) => (
                    <div key={idx} className="bg-gray-50 p-2 rounded border border-gray-200">
                      <div className="text-sm text-gray-800">{note.text}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {note.user} - {formatTime(note.timestamp)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="font-bold text-gray-800 mb-2">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-2">
                <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 rounded font-semibold text-sm flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" />
                  Call Responder
                </button>
                <button className="bg-purple-100 hover:bg-purple-200 text-purple-700 py-2 rounded font-semibold text-sm flex items-center justify-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Send Message
                </button>
                <button className="bg-orange-100 hover:bg-orange-200 text-orange-700 py-2 rounded font-semibold text-sm flex items-center justify-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Escalate
                </button>
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded font-semibold text-sm flex items-center justify-center gap-2">
                  <Camera className="w-4 h-4" />
                  View All Cams
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

AlertCard.defaultProps = {
  alert: {
    id: 'ALERT-001',
    type: 'overcrowding',
    severity: 'critical',
    status: 'active',
    location: 'Main Stage Area',
    camera: 'CAM-002',
    description: 'High crowd density detected',
    timestamp: new Date(),
    crowdCount: null,
    densityLevel: null,
    responderAssigned: null,
    eta: null,
    timeline: [],
    notes: []
  },
  onAcknowledge: null,
  onDismiss: null,
  onDispatch: null,
  onViewCamera: null
};

export default AlertCard;