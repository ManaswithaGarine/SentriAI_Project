// frontend/src/components/Dashboard_/AnomalyAlerts.jsx
import React, { useEffect, useRef, useState } from "react";

const AnomalyAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const audioRef = useRef(null);

  // Example: sample alerts (replace later if needed)
  useEffect(() => {
    const sampleAlerts = [
      {
        id: 1,
        type: "Overcrowding",
        location: "Gate A - Stadium Entry",
        severity: "High",
        timestamp: "2025-10-27 14:30:12",
      },
      {
        id: 2,
        type: "Panic Motion Detected",
        location: "Zone 3 - Food Court",
        severity: "Medium",
        timestamp: "2025-10-27 14:45:08",
      },
    ];
    setAlerts(sampleAlerts);
  }, []);

  // Play sound when alerts change
  useEffect(() => {
    if (alerts.length > 0 && audioRef.current) {
      audioRef.current
        .play()
        .catch(() => {
          // Browsers may block autoplay; this prevents an uncaught error
          // You can provide a UI button to "Enable sound" if needed.
          /* noop */
        });
    }
  }, [alerts]);

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Anomaly Alerts</h1>

      {/* Audio element points to public/alert.wav (recommended) */}
      <audio ref={audioRef} src="/alert.wav" preload="auto" />

      <div className="bg-white rounded-lg shadow-lg p-6">
        {alerts.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No active alerts detected.</p>
        ) : (
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-700 text-left">
                <th className="p-3 border-b">#</th>
                <th className="p-3 border-b">Alert Type</th>
                <th className="p-3 border-b">Location</th>
                <th className="p-3 border-b">Severity</th>
                <th className="p-3 border-b">Time</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert, index) => (
                <tr
                  key={alert.id}
                  className={`hover:bg-gray-50 ${
                    alert.severity === "High"
                      ? "text-red-600"
                      : alert.severity === "Medium"
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                >
                  <td className="p-3 border-b">{index + 1}</td>
                  <td className="p-3 border-b">{alert.type}</td>
                  <td className="p-3 border-b">{alert.location}</td>
                  <td className="p-3 border-b font-semibold">{alert.severity}</td>
                  <td className="p-3 border-b">{alert.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AnomalyAlerts;
