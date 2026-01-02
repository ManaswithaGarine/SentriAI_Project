import React, { useState, useEffect, useRef } from 'react';
import './PostEventReport.css';
import {
  FileText,
  Download,
  Calendar,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  MapPin,
  Camera,
  Shield,
  Activity,
  BarChart3,
  PieChart,
  Eye,
  Filter,
  Share2,
  Printer
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

/**
 * PostEventReport.jsx
 *
 * - Uses backend base URL: http://localhost:5000
 * - Fetches events list from GET /api/events
 * - Fetches event report from GET /api/events/{eventId}/report
 * - Polls the report endpoint every `POLL_MS` ms (default 10s)
 * - Gracefully falls back to sample data if backend endpoints are unavailable
 */

const BASE_URL = 'http://localhost:5000'; // <-- update if different
const POLL_MS = 10000; // 10 seconds

const PostEventReport = () => {
  const [events, setEvents] = useState([
    // fallback sample; replaced when /api/events succeeds
    { id: 'event-001', name: 'Music Festival 2025', date: '2025-10-20', duration: '8 hours' },
    { id: 'event-002', name: 'Sports Championship', date: '2025-10-15', duration: '6 hours' },
    { id: 'event-003', name: 'Tech Conference', date: '2025-10-10', duration: '10 hours' }
  ]);

  const [selectedEvent, setSelectedEvent] = useState('event-001');
  const [eventData, setEventData] = useState(null);
  const [reportType, setReportType] = useState('summary'); // reserved for future use
  const [dateRange, setDateRange] = useState('all'); // reserved for future use
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [liveUpdating, setLiveUpdating] = useState(true);

  const pollRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Fetch events list once on mount (fallback to built-in list on failure)
  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();
    fetch(`${BASE_URL}/api/events`, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Events fetch failed: ${res.status}`);
        const data = await res.json();
        if (!mounted) return;
        if (Array.isArray(data) && data.length > 0) {
          setEvents(data);
          setSelectedEvent((prev) => (data.some(e => e.id === prev) ? prev : data[0].id));
        }
      })
      .catch((err) => {
        // keep sample list on error; log for debugging
        console.warn('Could not fetch events list, using fallback sample events.', err);
      });
    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  // Fetch single event report (and set up polling if liveUpdating)
  useEffect(() => {
    // helper to fetch event report
    const fetchEventReport = async (signal) => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${BASE_URL}/api/events/${selectedEvent}/report`, { signal });
        if (!res.ok) {
          // try parse json error if any
          const text = await res.text().catch(() => null);
          throw new Error(`Report fetch failed: ${res.status} ${text ?? ''}`);
        }
        const data = await res.json();
        setEventData(data);
        setLastUpdated(new Date());
      } catch (err) {
        // If fetch aborted, do nothing
        if (err.name === 'AbortError') return;
        console.error('Error fetching event report:', err);
        setError('Unable to fetch live report. Showing fallback mock data (if available).');
        // fallback: if there is no eventData yet, set an inline mock to avoid blank UI
        if (!eventData) {
          const fallback = makeFallbackReport(selectedEvent);
          setEventData(fallback);
          setLastUpdated(new Date());
        }
      } finally {
        setLoading(false);
      }
    };

    // cancel previous controller
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // run immediate fetch
    fetchEventReport(controller.signal);

    // set up polling
    if (liveUpdating) {
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = setInterval(() => {
        // new controller for each poll so we can abort if needed
        if (abortControllerRef.current) abortControllerRef.current.abort();
        const c = new AbortController();
        abortControllerRef.current = c;
        fetchEventReport(c.signal);
      }, POLL_MS);
    } else {
      // not liveUpdating: clear poll if exists
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    }

    // cleanup on unmount or selectedEvent change
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEvent, liveUpdating]);

  // Toggle live updates
  const toggleLive = () => {
    setLiveUpdating(prev => !prev);
  };

  const handleDownloadPDF = () => {
    // TODO: replace with real PDF generation endpoint or client-side library (jsPDF/html2canvas)
    alert('Generating PDF report... This would download a comprehensive PDF document.');
  };

  const handleShareReport = () => {
    // TODO: implement share link creation via backend or email service
    alert('Share report via email or generate shareable link.');
  };

  const handlePrint = () => {
    window.print();
  };

  if (!eventData && loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading report data...</p>
        </div>
      </div>
    );
  }

  // Recharts palette fallback
  const COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#22c55e'];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-full overflow-y-auto report-scroll fade-in printable">
      {/* Header */}
      <div className="flex justify-between items-start mb-6 pb-6 border-b-2 border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Post-Event Analysis Report</h1>
          <div className="flex items-center gap-4 text-gray-600">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              <span className="font-semibold">{eventData?.eventName ?? '—'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{eventData?.date ?? '—'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{eventData?.startTime ?? '—'} - {eventData?.endTime ?? '—'}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>{eventData?.venue ?? '—'}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <div className="text-xs text-gray-500 mr-2">
            {error ? <span className="text-red-500 font-semibold">{error}</span> : null}
            {lastUpdated ? <div className="mt-1">Last updated: {lastUpdated.toLocaleString()}</div> : null}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleLive}
              title={liveUpdating ? 'Pause live updates' : 'Resume live updates'}
              className={`px-3 py-1 rounded text-sm font-semibold ${
                liveUpdating ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}
            >
              {liveUpdating ? 'Live' : 'Paused'}
            </button>

            <button
              onClick={handleShareReport}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Event Selector */}
      <div className="mb-6 flex gap-4 items-center">
        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {events.map(event => (
            <option key={event.id} value={event.id}>
              {event.name} - {event.date}
            </option>
          ))}
        </select>

        <div className="text-sm text-gray-600 flex items-center gap-2">
          <Activity className={`w-4 h-4 ${liveUpdating ? 'text-green-600 animate-pulse' : 'text-gray-400'}`} />
          <span>{liveUpdating ? 'Live updating every 10s' : 'Live updates paused'}</span>
        </div>
      </div>

      {/* Executive Summary Cards */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Executive Summary</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200 report-card">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-blue-600" />
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-blue-600">
              {eventData?.summary?.totalAttendees ? eventData.summary.totalAttendees.toLocaleString() : '—'}
            </div>
            <div className="text-sm text-blue-700 font-semibold">Total Attendees</div>
            <div className="text-xs text-blue-600 mt-1">Peak: {eventData?.summary?.peakCrowd ?? '—'} at {eventData?.summary?.peakTime ?? '—'}</div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200 report-card">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="text-green-600 font-bold">
                {eventData?.summary ? Math.round((eventData.summary.resolvedIncidents / Math.max(1, eventData.summary.totalIncidents)) * 100) : '—'}%
              </div>
            </div>
            <div className="text-3xl font-bold text-green-600">{eventData?.summary?.resolvedIncidents ?? '—'}/{eventData?.summary?.totalIncidents ?? '—'}</div>
            <div className="text-sm text-green-700 font-semibold">Incidents Resolved</div>
            <div className="text-xs text-green-600 mt-1">Resolution Rate: {eventData?.summary ? 'Excellent' : '—'}</div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg border-2 border-orange-200 report-card">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-orange-600" />
              <TrendingDown className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-orange-600">{eventData?.summary?.avgResponseTime ?? '—'}</div>
            <div className="text-sm text-orange-700 font-semibold">Avg Response Time</div>
            <div className="text-xs text-orange-600 mt-1">20% better than standard</div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200 report-card">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <div className="text-red-600 font-bold">{eventData?.summary?.criticalAlerts ?? '—'}</div>
            </div>
            <div className="text-3xl font-bold text-red-600">{eventData?.summary?.totalIncidents ?? '—'}</div>
            <div className="text-sm text-red-700 font-semibold">Total Incidents</div>
            <div className="text-xs text-red-600 mt-1">Critical: {eventData?.summary?.criticalAlerts ?? '—'}</div>
          </div>
        </div>
      </div>

      {/* Crowd Timeline Chart */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Crowd Density Over Time</h2>
        <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200 report-card">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={eventData?.crowdTimeline ?? []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis yAxisId="left" label={{ value: 'People Count', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: 'Density %', angle: 90, position: 'insideRight' }} />
              <Tooltip />
              <Legend />
              <Area yAxisId="left" type="monotone" dataKey="count" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} name="Crowd Count" />
              <Line yAxisId="right" type="monotone" dataKey="density" stroke="#ef4444" strokeWidth={2} name="Density %" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Incident Analysis */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Incident Analysis</h2>
        <div className="grid grid-cols-2 gap-6">
          {/* By Type */}
          <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200 report-card">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Incidents by Type</h3>
            <ResponsiveContainer width="100%" height={250}>
              <RePieChart>
                <Pie
                  data={eventData?.incidentsByType ?? []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {(eventData?.incidentsByType ?? []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color ?? COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          </div>

          {/* By Zone */}
          <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200 report-card">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Incidents by Zone</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={eventData?.incidentsByZone ?? []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="zone" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="incidents" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Response Metrics */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Response Performance</h2>
        <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200 report-card">
          <div className="space-y-4">
            {(eventData?.responseMetrics ?? []).map((metric, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-800">{metric.metric}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      Avg: <span className="font-bold">{metric.avgTime} min</span>
                    </span>
                    <span className="text-sm text-gray-600">
                      Target: <span className="font-bold">{metric.target} min</span>
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      metric.status === 'excellent' ? 'bg-green-100 text-green-700' :
                      metric.status === 'good' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {metric.status?.toUpperCase?.() ?? ''}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      metric.status === 'excellent' ? 'bg-green-500' :
                      metric.status === 'good' ? 'bg-blue-500' :
                      'bg-yellow-500'
                    }`}
                    style={{ width: `${Math.min(100, (metric.target / Math.max(0.0001, metric.avgTime)) * 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Density Hotspots */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">High Density Hotspots</h2>
        <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200 report-card">
          <div className="space-y-3">
            {(eventData?.densityHotspots ?? []).map((hotspot, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border-2 ${
                  hotspot.risk === 'high' ? 'bg-red-50 border-red-300' :
                  hotspot.risk === 'medium' ? 'bg-orange-50 border-orange-300' :
                  'bg-yellow-50 border-yellow-300'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <MapPin className={`w-6 h-6 ${
                      hotspot.risk === 'high' ? 'text-red-600' :
                      hotspot.risk === 'medium' ? 'text-orange-600' :
                      'text-yellow-600'
                    }`} />
                    <div>
                      <div className="font-bold text-gray-800">{hotspot.location}</div>
                      <div className="text-sm text-gray-600">Peak Duration: {hotspot.duration}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      hotspot.risk === 'high' ? 'text-red-600' :
                      hotspot.risk === 'medium' ? 'text-orange-600' :
                      'text-yellow-600'
                    }`}>
                      {hotspot.peakDensity}%
                    </div>
                    <div className={`text-xs font-semibold uppercase ${
                      hotspot.risk === 'high' ? 'text-red-700' :
                      hotspot.risk === 'medium' ? 'text-orange-700' :
                      'text-yellow-700'
                    }`}>
                      {hotspot.risk} Risk
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Performance */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">System Performance</h2>
        <div className="grid grid-cols-2 gap-6">
          {/* Camera Stats */}
          <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200 report-card">
            <div className="flex items-center gap-3 mb-4">
              <Camera className="w-8 h-8 text-blue-600" />
              <h3 className="font-bold text-lg text-blue-900">Camera Network</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-blue-700">Total Cameras:</span>
                <span className="font-bold text-blue-900">{eventData?.cameraStats?.totalCameras ?? '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Active During Event:</span>
                <span className="font-bold text-blue-900">{eventData?.cameraStats?.activeCameras ?? '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Recording Time:</span>
                <span className="font-bold text-blue-900">{eventData?.cameraStats?.totalRecordingTime ?? '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Alerts Triggered:</span>
                <span className="font-bold text-blue-900">{eventData?.cameraStats?.alertsTriggered ?? '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">AI Accuracy:</span>
                <span className="font-bold text-blue-900">{eventData?.cameraStats?.accuracy ?? '—'}%</span>
              </div>
            </div>
          </div>

          {/* Responder Stats */}
          <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200 report-card">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-green-600" />
              <h3 className="font-bold text-lg text-green-900">Responder Team</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-green-700">Total Responders:</span>
                <span className="font-bold text-green-900">{eventData?.responderStats?.totalResponders ?? '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Avg Tasks/Person:</span>
                <span className="font-bold text-green-900">{eventData?.responderStats?.avgTasksPerResponder ?? '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Total Dispatches:</span>
                <span className="font-bold text-green-900">{eventData?.responderStats?.totalDispatches ?? '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Success Rate:</span>
                <span className="font-bold text-green-900">{eventData?.responderStats?.successRate ?? '—'}%</span>
              </div>
              <div className="bg-white p-2 rounded mt-3">
                <div className="text-xs text-green-700">Top Performer</div>
                <div className="font-bold text-green-900">{eventData?.responderStats?.topPerformer ?? '—'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Recommendations for Future Events</h2>
        <div className="space-y-3">
          {(eventData?.recommendations ?? []).map((rec, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg border-2 ${
                rec.priority === 'high' ? 'bg-red-50 border-red-300' :
                rec.priority === 'medium' ? 'bg-orange-50 border-orange-300' :
                'bg-blue-50 border-blue-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                  rec.priority === 'high' ? 'bg-red-600 text-white' :
                  rec.priority === 'medium' ? 'bg-orange-600 text-white' :
                  'bg-blue-600 text-white'
                }`}>
                  {rec.priority?.toUpperCase?.()}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-gray-800 mb-1">{rec.category}</div>
                  <div className="text-sm text-gray-700 mb-2">
                    <span className="font-semibold">Issue:</span> {rec.issue}
                  </div>
                  <div className="text-sm text-gray-700">
                    <span className="font-semibold">Recommendation:</span> {rec.recommendation}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Highlights */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Event Highlights</h2>
        <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200 report-card">
          <div className="space-y-3">
            {(eventData?.highlights ?? []).map((highlight, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                <span className="text-gray-800">{highlight}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-6 border-t-2 border-gray-200 text-center text-gray-600 text-sm">
        <p>Report Generated: {new Date().toLocaleString()}</p>
        <p className="mt-1">SentriAI - AI-Powered Crowd Safety & Alert System</p>
      </div>
    </div>
  );
};

export default PostEventReport;

/**
 * Helper: fallback mock report (used when backend isn't available).
 * Keeps UI populated so the component doesn't crash.
 */
function makeFallbackReport(eventId = 'event-001') {
  return {
    eventId,
    eventName: 'Music Festival 2025',
    date: 'October 20, 2025',
    startTime: '14:00',
    endTime: '22:00',
    duration: '8 hours',
    venue: 'Grand Arena, Hyderabad',
    summary: {
      totalAttendees: 15847,
      peakCrowd: 12450,
      peakTime: '19:30',
      avgCrowdDensity: 62,
      totalIncidents: 23,
      resolvedIncidents: 21,
      avgResponseTime: '3.2 min',
      criticalAlerts: 5,
      medicalCases: 8,
      securityIssues: 12,
      crowdControlActions: 15
    },
    crowdTimeline: [
      { time: '14:00', count: 1250, density: 15 },
      { time: '15:00', count: 3420, density: 32 },
      { time: '16:00', count: 5680, density: 45 },
      { time: '17:00', count: 7890, density: 58 },
      { time: '18:00', count: 9340, density: 68 },
      { time: '19:00', count: 11200, density: 78 },
      { time: '19:30', count: 12450, density: 85 },
      { time: '20:00', count: 11800, density: 82 },
      { time: '21:00', count: 8900, density: 64 },
      { time: '22:00', count: 3200, density: 28 }
    ],
    incidentsByType: [
      { type: 'Overcrowding', count: 5, color: '#ef4444' },
      { type: 'Medical', count: 8, color: '#f97316' },
      { type: 'Security', count: 7, color: '#eab308' },
      { type: 'Lost Person', count: 3, color: '#3b82f6' }
    ],
    incidentsByZone: [
      { zone: 'Main Stage', incidents: 8 },
      { zone: 'Food Court', incidents: 5 },
      { zone: 'Exit Gates', incidents: 4 },
      { zone: 'Parking', incidents: 3 },
      { zone: 'Restrooms', incidents: 2 },
      { zone: 'VIP Area', incidents: 1 }
    ],
    responseMetrics: [
      { metric: 'Security Response', avgTime: 2.8, target: 3.0, status: 'good' },
      { metric: 'Medical Response', avgTime: 3.5, target: 4.0, status: 'good' },
      { metric: 'Crowd Control', avgTime: 4.2, target: 5.0, status: 'good' },
      { metric: 'Fire Safety', avgTime: 2.1, target: 2.5, status: 'excellent' }
    ],
    densityHotspots: [
      { location: 'Main Stage - Front', peakDensity: 92, duration: '45 min', risk: 'high' },
      { location: 'Exit Gate B', peakDensity: 78, duration: '30 min', risk: 'medium' },
      { location: 'Food Court Central', peakDensity: 68, duration: '60 min', risk: 'medium' },
      { location: 'Restroom Area 2', peakDensity: 55, duration: '20 min', risk: 'low' }
    ],
    cameraStats: {
      totalCameras: 24,
      activeCameras: 23,
      totalRecordingTime: '192 hours',
      alertsTriggered: 47,
      falsePositives: 8,
      accuracy: 83
    },
    responderStats: {
      totalResponders: 45,
      avgTasksPerResponder: 8.3,
      topPerformer: 'James Wilson (SEC-001)',
      totalDispatches: 67,
      successRate: 96
    },
    recommendations: [
      {
        priority: 'high',
        category: 'Crowd Control',
        issue: 'Main stage area exceeded safe density limits during peak hours',
        recommendation: 'Deploy additional barriers and increase crowd control personnel by 30% in front-stage area'
      },
      {
        priority: 'medium',
        category: 'Infrastructure',
        issue: 'Exit Gate B showed congestion during event conclusion',
        recommendation: 'Open additional exit points 30 minutes before event end time'
      },
      {
        priority: 'medium',
        category: 'Medical',
        issue: 'Higher than expected medical incidents (heat exhaustion)',
        recommendation: 'Increase hydration stations and add cooling zones'
      },
      {
        priority: 'low',
        category: 'Technology',
        issue: 'Camera CAM-015 offline for 45 minutes',
        recommendation: 'Implement redundant power backup for critical camera zones'
      }
    ],
    highlights: [
      'Zero critical injuries throughout the event',
      'All emergency protocols executed successfully',
      'Average response time 20% better than industry standard',
      'Positive sentiment score of 78% from social media monitoring',
      'Successful crowd redistribution prevented potential crush incidents'
    ]
  };
}
