// src/api/cameraService.js

const API_URL = 'http://localhost:5000';

export const getLiveFeed = async () => {
  try {
    const response = await fetch(`${API_URL}/camera_data`);
    if (!response.ok) throw new Error('Failed to fetch camera data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching camera data:', error);
    throw error;
  }
};

export const getCameraStreamURL = (cameraId) => {
  return `${API_URL}/video_feed`;
};

export const getCameraDetails = async (cameraId) => {
  const data = await getLiveFeed();
  return data.cameras.find(cam => cam.id === cameraId) || null;
};

export default {
  getLiveFeed,
  getCameraStreamURL,
  getCameraDetails
};