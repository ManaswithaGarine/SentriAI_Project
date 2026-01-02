// constants.js

// API Endpoints
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
export const WS_BASE_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:8000/ws';

export const API_ENDPOINTS = {
  ALERTS: '/api/alerts',
  CAMERAS: '/api/cameras',
  EVENTS: '/api/events',
  RESPONDERS: '/api/responders',
  ANALYTICS: '/api/analytics',
  HEATMAP: '/api/heatmap',
  REPORTS: '/api/reports'
};

// Alert Types
export const ALERT_TYPES = {
  OVERCROWDING: 'overcrowding',
  FIGHT: 'fight',
  PANIC: 'panic',
  FIRE: 'fire',
  MEDICAL: 'medical',
  SUSPICIOUS: 'suspicious_activity',
  STAMPEDE: 'stampede_risk'
};

// Alert Severity Levels
export const ALERT_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

// Alert Status
export const ALERT_STATUS = {
  PENDING: 'pending',
  ACKNOWLEDGED: 'acknowledged',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  FALSE_ALARM: 'false_alarm'
};

// Crowd Density Levels
export const CROWD_DENSITY = {
  LOW: { level: 'low', threshold: 30, color: '#4ade80' },
  MODERATE: { level: 'moderate', threshold: 60, color: '#fbbf24' },
  HIGH: { level: 'high', threshold: 85, color: '#fb923c' },
  CRITICAL: { level: 'critical', threshold: 100, color: '#ef4444' }
};

// Risk Score Thresholds
export const RISK_THRESHOLDS = {
  SAFE: 0,
  LOW: 30,
  MEDIUM: 50,
  HIGH: 75,
  CRITICAL: 90
};

// Camera Status
export const CAMERA_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  ERROR: 'error',
  MAINTENANCE: 'maintenance'
};

// Responder Status
export const RESPONDER_STATUS = {
  AVAILABLE: 'available',
  BUSY: 'busy',
  ON_SCENE: 'on_scene',
  OFFLINE: 'offline'
};

// Responder Types
export const RESPONDER_TYPES = {
  SECURITY: 'security',
  MEDICAL: 'medical',
  FIRE: 'fire',
  POLICE: 'police',
  MANAGER: 'event_manager'
};

// Map Settings
export const MAP_DEFAULTS = {
  CENTER: { lat: 17.385044, lng: 78.486671 }, // Hyderabad coordinates
  ZOOM: 15,
  MIN_ZOOM: 10,
  MAX_ZOOM: 20
};

// Dashboard Refresh Intervals (in milliseconds)
export const REFRESH_INTERVALS = {
  ALERTS: 5000,        // 5 seconds
  CAMERAS: 10000,      // 10 seconds
  HEATMAP: 15000,      // 15 seconds
  ANALYTICS: 30000     // 30 seconds
};

// Chart Colors
export const CHART_COLORS = {
  PRIMARY: '#3b82f6',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  DANGER: '#ef4444',
  INFO: '#06b6d4',
  PURPLE: '#8b5cf6',
  PINK: '#ec4899'
};

// Event Types
export const EVENT_TYPES = {
  CONCERT: 'concert',
  FESTIVAL: 'festival',
  SPORTS: 'sports',
  RALLY: 'political_rally',
  EXHIBITION: 'exhibition',
  CONFERENCE: 'conference'
};

// Notification Settings
export const NOTIFICATION_SETTINGS = {
  SOUND_ENABLED: true,
  VIBRATE_ENABLED: true,
  DESKTOP_ENABLED: true,
  PUSH_ENABLED: true
};

// Audio Alert Sounds
export const ALERT_SOUNDS = {
  CRITICAL: '/sounds/critical-alert.mp3',
  HIGH: '/sounds/high-alert.mp3',
  MEDIUM: '/sounds/medium-alert.mp3',
  LOW: '/sounds/low-alert.mp3'
};

// Time Formats
export const TIME_FORMATS = {
  FULL: 'MMMM DD, YYYY HH:mm:ss',
  SHORT: 'MMM DD, HH:mm',
  TIME_ONLY: 'HH:mm:ss',
  DATE_ONLY: 'YYYY-MM-DD'
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100]
};

// Local Storage Keys
export const STORAGE_KEYS = {
  USER_TOKEN: 'sentriai_user_token',
  USER_PROFILE: 'sentriai_user_profile',
  DASHBOARD_LAYOUT: 'sentriai_dashboard_layout',
  NOTIFICATION_PREFS: 'sentriai_notification_prefs',
  THEME: 'sentriai_theme'
};

// Social Media Platforms
export const SOCIAL_PLATFORMS = {
  TWITTER: 'twitter',
  FACEBOOK: 'facebook',
  INSTAGRAM: 'instagram',
  REDDIT: 'reddit'
};

// Panic Keywords (for social media monitoring)
export const PANIC_KEYWORDS = [
  'stampede', 'crush', 'panic', 'emergency', 'help', 
  'trapped', 'danger', 'fire', 'fight', 'chaos'
];

// Drone Status
export const DRONE_STATUS = {
  IDLE: 'idle',
  FLYING: 'flying',
  INVESTIGATING: 'investigating',
  RETURNING: 'returning',
  CHARGING: 'charging',
  ERROR: 'error'
};

// Export all constants as default object
export default {
  API_BASE_URL,
  WS_BASE_URL,
  API_ENDPOINTS,
  ALERT_TYPES,
  ALERT_SEVERITY,
  ALERT_STATUS,
  CROWD_DENSITY,
  RISK_THRESHOLDS,
  CAMERA_STATUS,
  RESPONDER_STATUS,
  RESPONDER_TYPES,
  MAP_DEFAULTS,
  REFRESH_INTERVALS,
  CHART_COLORS,
  EVENT_TYPES,
  NOTIFICATION_SETTINGS,
  ALERT_SOUNDS,
  TIME_FORMATS,
  PAGINATION,
  STORAGE_KEYS,
  SOCIAL_PLATFORMS,
  PANIC_KEYWORDS,
  DRONE_STATUS
};