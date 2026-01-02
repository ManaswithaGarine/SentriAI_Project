// src/services/api.js
// Central API service for SentriAI Dashboard

import axios from 'axios';

// Base API URL - FIXED TO PORT 8000
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);

      if (error.response.status === 401) {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
    } else if (error.request) {
      console.error('No response from server');
    } else {
      console.error('Request error:', error.message);
    }
    return Promise.reject(error);
  }
);

// All API exports remain the same...
export const dashboardAPI = {
  getStats: () => apiClient.get('/dashboard/stats'),
  getRecentAlerts: (limit = 5) => apiClient.get(`/dashboard/alerts/recent?limit=${limit}`),
  getCrowdTrends: (eventId = null) => {
    const url = eventId ? `/dashboard/trends?eventId=${eventId}` : '/dashboard/trends';
    return apiClient.get(url);
  },
  getHotspots: () => apiClient.get('/dashboard/hotspots'),
  getCameraStatus: () => apiClient.get('/dashboard/cameras/status'),
};

export const crowdAPI = {
  getLiveCrowdData: () => apiClient.get('/crowd/live'),
  getDensityByZone: (zoneId) => apiClient.get(`/crowd/density/${zoneId}`),
  getCrowdHistory: (startTime, endTime) =>
    apiClient.get('/crowd/history', { params: { startTime, endTime } }),
  getHeatmap: (eventId = null) => {
    const url = eventId ? `/crowd/heatmap?eventId=${eventId}` : '/crowd/heatmap';
    return apiClient.get(url);
  },
  getPeopleCount: () => apiClient.get('/crowd/count'),
};

export const alertAPI = {
  getAlerts: (filters = {}) => apiClient.get('/alerts', { params: filters }),
  getAlertById: (alertId) => apiClient.get(`/alerts/${alertId}`),
  createAlert: (alertData) => apiClient.post('/alerts', alertData),
  acknowledgeAlert: (alertId, userId) =>
    apiClient.post(`/alerts/${alertId}/acknowledge`, { userId }),
  resolveAlert: (alertId, resolution) =>
    apiClient.post(`/alerts/${alertId}/resolve`, resolution),
  dismissAlert: (alertId) => apiClient.delete(`/alerts/${alertId}`),
  getActiveAlertsCount: () => apiClient.get('/alerts/count/active'),
};

export const cameraAPI = {
  getCameras: () => apiClient.get('/cameras'),
  getCameraById: (cameraId) => apiClient.get(`/cameras/${cameraId}`),
  getCameraFeed: (cameraId) => apiClient.get(`/cameras/${cameraId}/feed`),
  getCameraStatus: (cameraId) => apiClient.get(`/cameras/${cameraId}/status`),
  getCamerasByZone: (zoneId) => apiClient.get(`/cameras/zone/${zoneId}`),
  getDetections: (cameraId, limit = 10) => 
    apiClient.get(`/cameras/${cameraId}/detections?limit=${limit}`),
  takeSnapshot: (cameraId) => apiClient.post(`/cameras/${cameraId}/snapshot`),
  toggleRecording: (cameraId, status) =>
    apiClient.post(`/cameras/${cameraId}/recording`, { status }),
};

export const healthCheck = () => apiClient.get('/health');

export default {
  dashboardAPI,
  crowdAPI,
  alertAPI,
  cameraAPI,
  healthCheck,
};