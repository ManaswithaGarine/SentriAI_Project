import React, { useState, useEffect } from 'react';
import { 
  Bell,
  User,
  Settings,
  LogOut,
  Shield,
  Clock,
  Activity,
  AlertTriangle,
  ChevronDown,
  Search,
  Menu,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';

const Navbar = ({ onMenuToggle, userName = 'Admin User', userRole = 'Control Room Operator' }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [systemStatus, setSystemStatus] = useState('operational');

  const { logout } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const sampleNotifications = [
      {
        id: 1,
        type: 'critical',
        title: 'Critical Alert',
        message: 'Overcrowding detected at Main Stage',
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        read: false
      },
      {
        id: 2,
        type: 'warning',
        title: 'High Crowd Density',
        message: 'Exit Gate B approaching capacity',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        read: false
      },
      {
        id: 3,
        type: 'info',
        title: 'System Update',
        message: 'Camera CAM-015 back online',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        read: true
      }
    ];
    setNotifications(sampleNotifications);
    setUnreadCount(sampleNotifications.filter(n => !n.read).length);
  }, []);

  const formatTime = (date) =>
    date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const formatDate = (date) =>
    date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  const formatNotificationTime = (date) => {
    const diffMins = Math.floor((new Date() - date) / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours}h ago`;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'info':
        return <Activity className="w-5 h-5 text-blue-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (systemStatus) {
      case 'operational': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-gray-900 shadow-2xl border-b-2 border-red-900/30 sticky top-0 z-50">
      <div className="px-6 py-3 flex items-center justify-between">
        {/* Left Section - Logo */}
        <div className="flex items-center gap-4">
          <button onClick={onMenuToggle} className="lg:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <Menu className="w-6 h-6 text-gray-300" />
          </button>

          <div className="flex items-center gap-3">
            {/* Your Logo */}
            <div className="flex-shrink-0">
              <img 
                src="/logo.png" 
                alt="SentriAI Logo" 
                className="w-12 h-12 object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">SentriAI</h1>
              <p className="text-xs text-red-400">Crowd Safety & Alert System</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-lg border border-red-900/30">
            <div className={`w-2 h-2 rounded-full ${getStatusColor()} animate-pulse`}></div>
            <span className="text-sm font-semibold text-gray-300 capitalize">{systemStatus}</span>
          </div>
        </div>

        {/* Center - Time */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg border border-red-900/30">
            <Clock className="w-5 h-5 text-red-400" />
            <div className="text-right">
              <div className="text-sm font-bold text-white">{formatTime(currentTime)}</div>
              <div className="text-xs text-gray-400">{formatDate(currentTime)}</div>
            </div>
          </div>
        </div>

        {/* Right - User and Notifications */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Bell className="w-6 h-6 text-gray-300" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-2xl border-2 border-red-900/30">
                <div className="p-4 border-b border-red-900/30 flex justify-between">
                  <h3 className="font-bold text-white">Notifications</h3>
                  <button
                    onClick={() => {
                      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                      setUnreadCount(0);
                    }}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    Mark all as read
                  </button>
                </div>

                <div className="max-h-64 overflow-y-auto custom-scrollbar">
                  {notifications.map(notification => (
                    <div
                      key={notification.id}
                      onClick={() => {
                        setNotifications(prev => prev.map(n =>
                          n.id === notification.id ? { ...n, read: true } : n
                        ));
                        setUnreadCount(prev => Math.max(0, prev - 1));
                      }}
                      className={`p-4 hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-700/50 ${
                        !notification.read ? 'bg-red-900/20' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {getNotificationIcon(notification.type)}
                        <div>
                          <h4 className="font-semibold text-sm text-white">{notification.title}</h4>
                          <p className="text-sm text-gray-400">{notification.message}</p>
                          <span className="text-xs text-gray-500">
                            {formatNotificationTime(notification.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-semibold text-white">{userName}</div>
                <div className="text-xs text-gray-400">{userRole}</div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-2xl border-2 border-red-900/30">
                <div className="p-4 border-b border-red-900/30">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center shadow-lg">
                      <User className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-white">{userName}</div>
                      <div className="text-sm text-gray-400">{userRole}</div>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-700 rounded-lg text-left transition-colors">
                    <Settings className="w-5 h-5 text-gray-400" />
                    <span className="text-sm font-semibold text-gray-300">Settings</span>
                  </button>
                </div>

                <div className="p-2 border-t border-red-900/30">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-900/20 rounded-lg text-left transition-colors"
                  >
                    <LogOut className="w-5 h-5 text-red-400" />
                    <span className="text-sm font-semibold text-red-400">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

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
    </nav>
  );
};

export default Navbar;