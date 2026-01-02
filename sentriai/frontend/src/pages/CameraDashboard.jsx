import React, { useEffect, useState, useRef } from "react";

const CameraDashboard = () => {
  const [cameras, setCameras] = useState([
    {
      id: 'cam-001',
      name: 'Webcam 1',
      zone: 'Local Device',
      status: 'Active',
      peopleCount: 0,
      crowdDensity: 0,
      alert: false,
      alertType: null,
    }
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    // Access webcam
    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 640, height: 480 } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setLoading(false);
      } catch (err) {
        console.error("Error accessing webcam:", err);
        setError("Unable to access webcam. Please grant camera permissions.");
        setLoading(false);
      }
    };

    startWebcam();

    // Cleanup
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Starting webcam...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-red-50 border border-red-400 rounded-lg p-6 max-w-md">
          <h2 className="text-xl font-bold text-red-700 mb-2">Camera Access Error</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">📡 Real-Time Camera Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-green-400 rounded-xl shadow p-4 transition hover:shadow-lg">
          <h2 className="font-semibold text-xl text-gray-800">Live Webcam Feed</h2>
          <p className="text-sm text-gray-500">Local Device</p>

          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="rounded mt-3 w-full h-48 object-cover bg-gray-900"
          />

          <div className="mt-3 text-sm space-y-1 text-gray-700">
            <p>🧍 People Count: <span className="font-semibold">Detecting...</span></p>
            <p>📊 Crowd Density: <span className="font-semibold">Analyzing...</span></p>
            <p>⚠️ Alert: <span className="font-semibold">No Alert</span></p>
            <p>🔴 Status: <span className="font-semibold">Active</span></p>
          </div>

          <div className="mt-3 p-2 rounded text-center font-semibold text-white bg-green-500">
            ✅ Normal
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraDashboard;