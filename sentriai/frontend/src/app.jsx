// src/App.jsx
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ErrorBoundary from "./components/Common/ErrorBoundary";
import { LoadingOverlay } from "./components/Common/LoadingSpinner";
import Navbar from "./components/Common/Navbar";
import Sidebar from "./components/Common/Sidebar";

// Import pages
import DashboardPage from "./pages/DashboardPage";
import LiveMonitoring from "./pages/LiveMonitoring";
import Reports from "./pages/Reports";
import LoginPage from "./pages/LoginPage";
import AlertsPage from "./pages/AlertsPage";
import HeatmapPage from "./pages/HeatmapPage";
import SentimentPage from "./pages/SentimentPage";
import RespondersPage from "./pages/RespondersPage";
import CamerasPage from "./pages/CamerasPage";
import AnalyticsPage from './pages/AnalyticsPage';
import VideoAnalysisPage from './pages/VideoAnalysisPage';
import CameraDashboard from "./pages/CameraDashboard";
import SettingsPage from "./pages/SettingsPage";
import HelpSupportPage from "./pages/HelpSupportPage";

// Placeholder for unimplemented pages
const PlaceholderPage = ({ title }) => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>
    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
      <p className="text-gray-600 mb-4">This page is under development.</p>
      <p className="text-sm text-gray-500">Navigate using the sidebar menu.</p>
    </div>
  </div>
);

function App() {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (loading) {
    return <LoadingOverlay />;
  }

  return (
    <ErrorBoundary>
      <Router>
        {/* ALWAYS start with login page if not authenticated */}
        {!user ? (
          <Routes>
            {/* All routes point to LoginPage until user signs in */}
            <Route path="/*" element={<LoginPage />} />
          </Routes>
        ) : (
          // Authenticated layout
          <div
            style={{
              display: "flex",
              minHeight: "100vh",
              backgroundColor: "#f5f5f5",
            }}
          >
            <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

            <div
              style={{
                flex: 1,
                marginLeft: sidebarOpen ? "256px" : "80px",
                transition: "margin-left 0.3s ease",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

              <main style={{ flex: 1, overflowY: "auto" }}>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/live-monitoring" element={<LiveMonitoring />} />
                  <Route path="/alerts" element={<AlertsPage />} />
                  <Route path="/heatmap" element={<HeatmapPage />} />
                  <Route path="/sentiment" element={<SentimentPage />} />
                  <Route path="/responders" element={<RespondersPage />} />
                  <Route path="/cameras" element={<CamerasPage />} />
                  <Route path="/cameras-live" element={<CameraDashboard />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/video-analysis" element={<VideoAnalysisPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/help" element={<HelpSupportPage />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </main>
            </div>
          </div>
        )}
      </Router>
    </ErrorBoundary>
  );
}

export default App;