import React, { useState, useEffect } from 'react';
import { 
  Users,
  AlertTriangle,
  Camera,
  Shield,
  Activity,
  MapPin,
  Bell,
  Eye,
  Zap,
  TrendingUp,
  CheckCircle,
  Brain,
  Radio
} from 'lucide-react';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalAttendees: 12450,
    activeAlerts: 5,
    activeCameras: 23,
    totalCameras: 24,
    availableResponders: 32,
    totalResponders: 45
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalAttendees: prev.totalAttendees + Math.floor((Math.random() - 0.5) * 30)
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          {/* Hero Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <img 
                src="/logo.png" 
                alt="SentriAI Logo" 
                className="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-2xl animate-pulse"
              />
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
            Intelligent Crowd Safety & Alert System
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            AI-powered real-time monitoring and management system for crowd safety at large events, 
            festivals, and public gatherings. Protecting lives through intelligent surveillance.
          </p>
        </div>

        {/* Live Stats Bar */}
        <div className="bg-gray-900 rounded-2xl shadow-2xl shadow-red-900/20 p-8 mb-12 border-2 border-red-900/30">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-full mb-3 shadow-lg shadow-red-900/50">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-white">{stats.totalAttendees.toLocaleString()}</div>
              <div className="text-sm text-gray-400 mt-1">Live Attendees</div>
              <div className="mt-2">
                <span className="inline-flex items-center gap-1 text-xs text-red-400 font-semibold">
                  <Activity className="w-3 h-3 animate-pulse" />
                  Real-time tracking
                </span>
              </div>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-full mb-3 shadow-lg shadow-red-900/50">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-white">{stats.activeAlerts}</div>
              <div className="text-sm text-gray-400 mt-1">Active Alerts</div>
              <div className="mt-2">
                <span className="inline-flex items-center gap-1 text-xs text-red-400 font-semibold">
                  <Bell className="w-3 h-3 animate-pulse" />
                  Monitoring
                </span>
              </div>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full mb-3 shadow-lg border-2 border-red-900/30">
                <Camera className="w-8 h-8 text-red-400" />
              </div>
              <div className="text-3xl font-bold text-white">{stats.activeCameras}/{stats.totalCameras}</div>
              <div className="text-sm text-gray-400 mt-1">Cameras Online</div>
              <div className="mt-2">
                <span className="inline-flex items-center gap-1 text-xs text-green-400 font-semibold">
                  <CheckCircle className="w-3 h-3" />
                  96% uptime
                </span>
              </div>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full mb-3 shadow-lg border-2 border-red-900/30">
                <Shield className="w-8 h-8 text-red-400" />
              </div>
              <div className="text-3xl font-bold text-white">{stats.availableResponders}/{stats.totalResponders}</div>
              <div className="text-sm text-gray-400 mt-1">Responders Ready</div>
              <div className="mt-2">
                <span className="inline-flex items-center gap-1 text-xs text-red-400 font-semibold">
                  <Radio className="w-3 h-3" />
                  Connected
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* What We Do Section */}
        <div className="mb-12">
          <h3 className="text-3xl font-bold text-white mb-8 text-center">
            What SentriAI Does
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-900 rounded-2xl shadow-xl p-8 hover:shadow-2xl hover:shadow-red-900/30 transition-all border-2 border-red-900/30 hover:border-red-700">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center shadow-lg">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-3">AI-Powered Crowd Analysis</h4>
                  <p className="text-gray-400 leading-relaxed">
                    Our advanced AI algorithms analyze video feeds in real-time to detect crowd density, 
                    movement patterns, and potential safety hazards before they become critical incidents.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-2xl shadow-xl p-8 hover:shadow-2xl hover:shadow-red-900/30 transition-all border-2 border-red-900/30 hover:border-red-700">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center shadow-lg">
                    <AlertTriangle className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-3">Intelligent Alert System</h4>
                  <p className="text-gray-400 leading-relaxed">
                    Instant notifications for overcrowding, unusual behavior, medical emergencies, and 
                    security threats. Smart priority-based alerting ensures the right people respond immediately.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-2xl shadow-xl p-8 hover:shadow-2xl hover:shadow-red-900/30 transition-all border-2 border-red-900/30 hover:border-red-700">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center shadow-lg">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-3">Multi-Camera Surveillance</h4>
                  <p className="text-gray-400 leading-relaxed">
                    Monitor multiple camera feeds simultaneously with automatic anomaly detection. 
                    Our system highlights suspicious activities and crowd congestion across all zones.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-2xl shadow-xl p-8 hover:shadow-2xl hover:shadow-red-900/30 transition-all border-2 border-red-900/30 hover:border-red-700">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center shadow-lg">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-3">Rapid Response Coordination</h4>
                  <p className="text-gray-400 leading-relaxed">
                    Connect security teams, medical responders, and event staff in real-time. 
                    Optimize response times with intelligent dispatching and live location tracking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-2xl shadow-2xl shadow-red-900/50 p-10 text-white mb-12 border-2 border-red-700">
          <h3 className="text-3xl font-bold mb-8 text-center">Powerful Features</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-10 rounded-full mb-4 backdrop-blur">
                <MapPin className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold mb-2">Heatmap Visualization</h4>
              <p className="text-red-100">
                Visual density maps showing crowd concentration in real-time across all event zones
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-10 rounded-full mb-4 backdrop-blur">
                <Eye className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold mb-2">Sentiment Analysis</h4>
              <p className="text-red-100">
                Monitor social media and detect panic or distress signals from event attendees
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-10 rounded-full mb-4 backdrop-blur">
                <Zap className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold mb-2">Instant Reporting</h4>
              <p className="text-red-100">
                Generate comprehensive incident reports and analytics for post-event review
              </p>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-gray-900 rounded-2xl shadow-xl p-8 border-2 border-red-900/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">System Status</h4>
                <p className="text-gray-400">All systems operational and monitoring</p>
              </div>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-800 rounded-full shadow-lg">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-white">LIVE</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Music Festival 2025
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-6">
            Navigate through the sidebar to access different monitoring features
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 border-2 border-red-900/30 rounded-lg text-sm text-gray-300 hover:border-red-700 transition-colors cursor-pointer">
              <MapPin className="w-4 h-4 text-red-400" />
              Live Event Map
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 border-2 border-red-900/30 rounded-lg text-sm text-gray-300 hover:border-red-700 transition-colors cursor-pointer">
              <Bell className="w-4 h-4 text-red-400" />
              Anomaly Alerts
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 border-2 border-red-900/30 rounded-lg text-sm text-gray-300 hover:border-red-700 transition-colors cursor-pointer">
              <Camera className="w-4 h-4 text-red-400" />
              Video Feeds
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 border-2 border-red-900/30 rounded-lg text-sm text-gray-300 hover:border-red-700 transition-colors cursor-pointer">
              <Shield className="w-4 h-4 text-red-400" />
              Responder Status
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;