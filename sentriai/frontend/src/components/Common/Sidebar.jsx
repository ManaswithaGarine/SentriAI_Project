import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  Bell,
  Flame,
  Users,
  Video,
  MessageSquare,
  FileText,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Activity,
  Shield,
  Camera,
  TrendingUp,
  AlertTriangle,
  Upload,
  MonitorPlay
} from 'lucide-react';

const Sidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      badge: null,
    },
    {
      id: 'live-map',
      label: 'Live Event Map',
      icon: Map,
      path: '/live-monitoring',
      badge: null,
    },
    {
      id: 'alerts',
      label: 'Anomaly Alerts',
      icon: Bell,
      path: '/alerts',
      badge: 5,
    },
    {
      id: 'heatmap',
      label: 'Crowd Heatmap',
      icon: Flame,
      path: '/heatmap',
      badge: null,
    },
    {
      id: 'sentiment',
      label: 'Panic Sentiment',
      icon: MessageSquare,
      path: '/sentiment',
      badge: 2,
    },
    {
      id: 'responders',
      label: 'Responder Status',
      icon: Shield,
      path: '/responders',
      badge: null,
    },
    {
      id: 'cameras',
      label: 'Video Feeds',
      icon: Video,
      path: '/cameras',
      badge: 23,
    },
    {
      id: 'cameras-live',
      label: 'Live Camera Dashboard',
      icon: MonitorPlay,
      path: '/cameras-live',
      badge: null,
    },
    {
      id: 'video-analysis',
      label: 'Video Analysis',
      icon: Upload,
      path: '/video-analysis',
      badge: null,
    }
  ];

  const secondaryItems = [
    {
      id: 'reports',
      label: 'Event Reports',
      icon: FileText,
      path: '/reports',
      badge: null,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      path: '/analytics',
      badge: null,
    }
  ];

  const bottomItems = [
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      path: '/settings',
      badge: null,
    },
    {
      id: 'help',
      label: 'Help & Support',
      icon: HelpCircle,
      path: '/help',
      badge: null,
    }
  ];

  const renderNavItem = (item) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path || location.pathname === item.path + '/';

    return (
      <NavLink
        key={item.id}
        to={item.path}
        onMouseEnter={() => setHoveredItem(item.id)}
        onMouseLeave={() => setHoveredItem(null)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative ${
          isActive
            ? 'bg-gradient-to-r from-red-600 to-red-700 border-l-4 border-red-400 font-semibold shadow-lg'
            : 'hover:bg-gray-800 border-l-4 border-transparent hover:border-red-600'
        }`}
      >
        <Icon
          className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-red-400'} transition-colors`}
        />
        {isOpen && (
          <>
            <span className={`flex-1 text-left text-sm ${
              isActive ? 'text-white' : 'text-gray-300'
            }`}>
              {item.label}
            </span>
            {item.badge && (
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                {item.badge}
              </span>
            )}
          </>
        )}

        {!isOpen && item.badge && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {item.badge}
          </span>
        )}
      </NavLink>
    );
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-gray-900 shadow-2xl border-r-2 border-red-900/30 transition-all duration-300 z-50 flex flex-col ${
          isOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-2 border-red-900/30">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="flex-shrink-0">
              <img 
                src="/logo.png" 
                alt="SentriAI Logo" 
                className="w-10 h-10 object-contain"
              />
            </div>
            
            {/* Brand Name */}
            {isOpen && (
              <div>
                <h2 className="text-lg font-bold text-white">SentriAI</h2>
                <p className="text-xs text-red-400">Crowd Safety System</p>
              </div>
            )}
          </div>

          <button
            onClick={onToggle}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            {isOpen ? (
              <ChevronLeft className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-2 custom-scrollbar">
          {/* Main Navigation */}
          <div className="mb-6">
            {isOpen && (
              <div className="px-4 mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase">Main Menu</span>
              </div>
            )}
            <div className="space-y-1">
              {navItems.map(item => renderNavItem(item))}
            </div>
          </div>

          {/* Secondary Navigation */}
          <div className="mb-6">
            {isOpen && (
              <div className="px-4 mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase">Reports & Data</span>
              </div>
            )}
            <div className="space-y-1">
              {secondaryItems.map(item => renderNavItem(item))}
            </div>
          </div>

          {/* System Status */}
          {isOpen && (
            <div className="mx-2 mb-4 p-3 bg-gradient-to-br from-red-900/30 to-gray-800 border-2 border-red-900/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-red-400" />
                <span className="text-xs font-bold text-red-400">System Status</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">All Systems</span>
                  <span className="font-bold text-green-400">Operational</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Active Cameras</span>
                  <span className="font-bold text-white">23/24</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Responders</span>
                  <span className="font-bold text-white">45 Online</span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          {isOpen && (
            <div className="mx-2 mb-4 space-y-2">
              <div className="p-3 bg-gradient-to-br from-red-900/30 to-gray-800 border border-red-900/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-red-400" />
                    <span className="text-xs font-semibold text-gray-300">Live Attendees</span>
                  </div>
                  <span className="text-sm font-bold text-red-400">12,450</span>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-br from-red-900/30 to-gray-800 border border-red-900/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span className="text-xs font-semibold text-gray-300">Active Alerts</span>
                  </div>
                  <span className="text-sm font-bold text-red-400">5</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="border-t-2 border-red-900/30 p-2">
          <div className="space-y-1">
            {bottomItems.map(item => renderNavItem(item))}
          </div>
        </div>

        {/* Collapsed state indicator */}
        {!isOpen && (
          <div className="p-2 border-t border-red-900/30">
            <div className="w-2 h-2 bg-red-500 rounded-full mx-auto animate-pulse"></div>
          </div>
        )}
      </aside>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f2937;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #dc2626;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ef4444;
        }
      `}</style>
    </>
  );
};

Sidebar.defaultProps = {
  isOpen: true,
  onToggle: () => {}
};

export default Sidebar;