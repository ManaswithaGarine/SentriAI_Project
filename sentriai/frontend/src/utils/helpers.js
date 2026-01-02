// helpers.js
import { 
  ALERT_SEVERITY, 
  CROWD_DENSITY, 
  RISK_THRESHOLDS,
  TIME_FORMATS 
} from './constants';

// Format timestamp to readable date/time
export const formatTimestamp = (timestamp, format = TIME_FORMATS.FULL) => {
  const date = new Date(timestamp);
  
  const pad = (num) => String(num).padStart(2, '0');
  
  const formats = {
    'YYYY': date.getFullYear(),
    'MM': pad(date.getMonth() + 1),
    'DD': pad(date.getDate()),
    'HH': pad(date.getHours()),
    'mm': pad(date.getMinutes()),
    'ss': pad(date.getSeconds()),
    'MMMM': date.toLocaleString('en-US', { month: 'long' }),
    'MMM': date.toLocaleString('en-US', { month: 'short' })
  };

  let formattedDate = format;
  Object.keys(formats).forEach(key => {
    formattedDate = formattedDate.replace(key, formats[key]);
  });

  return formattedDate;
};

// Get time ago (e.g., "2 minutes ago")
export const getTimeAgo = (timestamp) => {
  const now = Date.now();
  const diff = now - new Date(timestamp).getTime();
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

// Get severity color
export const getSeverityColor = (severity) => {
  const colors = {
    [ALERT_SEVERITY.LOW]: '#10b981',
    [ALERT_SEVERITY.MEDIUM]: '#f59e0b',
    [ALERT_SEVERITY.HIGH]: '#fb923c',
    [ALERT_SEVERITY.CRITICAL]: '#ef4444'
  };
  return colors[severity] || '#6b7280';
};

// Get crowd density level from percentage
export const getCrowdDensityLevel = (densityPercent) => {
  if (densityPercent >= CROWD_DENSITY.CRITICAL.threshold) {
    return CROWD_DENSITY.CRITICAL;
  } else if (densityPercent >= CROWD_DENSITY.HIGH.threshold) {
    return CROWD_DENSITY.HIGH;
  } else if (densityPercent >= CROWD_DENSITY.MODERATE.threshold) {
    return CROWD_DENSITY.MODERATE;
  }
  return CROWD_DENSITY.LOW;
};

// Calculate risk score based on multiple factors
export const calculateRiskScore = (crowdDensity, anomalies, panicLevel) => {
  const densityScore = crowdDensity * 0.5;
  const anomalyScore = anomalies * 10;
  const panicScore = panicLevel * 0.3;
  
  return Math.min(100, densityScore + anomalyScore + panicScore);
};

// Get risk level from score
export const getRiskLevel = (score) => {
  if (score >= RISK_THRESHOLDS.CRITICAL) return 'critical';
  if (score >= RISK_THRESHOLDS.HIGH) return 'high';
  if (score >= RISK_THRESHOLDS.MEDIUM) return 'medium';
  if (score >= RISK_THRESHOLDS.LOW) return 'low';
  return 'safe';
};

// Calculate distance between two coordinates (Haversine formula)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance.toFixed(2); // Returns km
};

const toRad = (value) => (value * Math.PI) / 180;

// Find nearest responder to an alert
export const findNearestResponder = (alertLocation, responders) => {
  let nearest = null;
  let minDistance = Infinity;

  responders.forEach(responder => {
    if (responder.status === 'available') {
      const distance = calculateDistance(
        alertLocation.lat,
        alertLocation.lng,
        responder.location.lat,
        responder.location.lng
      );

      if (parseFloat(distance) < minDistance) {
        minDistance = parseFloat(distance);
        nearest = { ...responder, distance };
      }
    }
  });

  return nearest;
};

// Format large numbers (e.g., 1500 -> "1.5K")
export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

// Debounce function for search/input
export const debounce = (func, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Throttle function for scroll/resize events
export const throttle = (func, limit = 100) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Play alert sound based on severity
export const playAlertSound = (severity) => {
  try {
    const audio = new Audio(`/sounds/${severity}-alert.mp3`);
    audio.play().catch(err => console.error('Error playing sound:', err));
  } catch (error) {
    console.error('Audio not supported:', error);
  }
};

// Generate unique ID
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Validate coordinate
export const isValidCoordinate = (lat, lng) => {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
};

// Get color for heatmap based on intensity
export const getHeatmapColor = (intensity) => {
  // intensity from 0 to 1
  if (intensity < 0.25) return 'rgba(0, 255, 0, 0.6)'; // Green
  if (intensity < 0.5) return 'rgba(255, 255, 0, 0.6)'; // Yellow
  if (intensity < 0.75) return 'rgba(255, 165, 0, 0.6)'; // Orange
  return 'rgba(255, 0, 0, 0.8)'; // Red
};

// Sort alerts by priority (critical first)
export const sortAlertsByPriority = (alerts) => {
  const priorityOrder = {
    [ALERT_SEVERITY.CRITICAL]: 0,
    [ALERT_SEVERITY.HIGH]: 1,
    [ALERT_SEVERITY.MEDIUM]: 2,
    [ALERT_SEVERITY.LOW]: 3
  };

  return [...alerts].sort((a, b) => {
    const priorityDiff = priorityOrder[a.severity] - priorityOrder[b.severity];
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(b.timestamp) - new Date(a.timestamp);
  });
};

// Filter alerts by status
export const filterAlertsByStatus = (alerts, status) => {
  return alerts.filter(alert => alert.status === status);
};

// Get browser notification permission
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('Notifications not supported');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

// Show browser notification
export const showNotification = (title, options = {}) => {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/logo.png',
      badge: '/badge.png',
      ...options
    });
  }
};

// Export coordinates to string
export const coordsToString = (lat, lng) => {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
};

// Parse coordinate string
export const stringToCoords = (coordString) => {
  const [lat, lng] = coordString.split(',').map(c => parseFloat(c.trim()));
  return { lat, lng };
};

// Local storage helpers
export const storage = {
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },
  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};

export default {
  formatTimestamp,
  getTimeAgo,
  getSeverityColor,
  getCrowdDensityLevel,
  calculateRiskScore,
  getRiskLevel,
  calculateDistance,
  findNearestResponder,
  formatNumber,
  debounce,
  throttle,
  playAlertSound,
  generateId,
  isValidCoordinate,
  getHeatmapColor,
  sortAlertsByPriority,
  filterAlertsByStatus,
  requestNotificationPermission,
  showNotification,
  coordsToString,
  stringToCoords,
  storage
};