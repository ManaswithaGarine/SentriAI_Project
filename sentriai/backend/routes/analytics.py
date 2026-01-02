from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
import numpy as np
from collections import defaultdict, deque
import json

# Create Blueprint for analytics routes
analytics_bp = Blueprint('analytics', __name__, url_prefix='/api/analytics')

# In-memory storage for analytics data
crowd_data_history = deque(maxlen=10000)  # Store last 10000 data points
heatmap_data = defaultdict(lambda: {'density': [], 'timestamps': []})
event_timeline = []


class AnalyticsEngine:
    """Handles data analysis, reporting, and visualization preparation"""
    
    def __init__(self):
        self.zone_names = {
            'ZONE_A': 'Main Entrance',
            'ZONE_B': 'Stage Area',
            'ZONE_C': 'Food Court',
            'ZONE_D': 'Exit Area',
            'ZONE_E': 'VIP Section'
        }
    
    def store_crowd_data(self, data):
        """Store crowd monitoring data for analysis"""
        entry = {
            'timestamp': datetime.now().isoformat(),
            'person_count': data.get('person_count', 0),
            'density': data.get('density', 0),
            'risk_level': data.get('risk_level', 'LOW'),
            'risk_score': data.get('risk_score', 0),
            'zone': data.get('zone', 'ZONE_A'),
            'camera_id': data.get('camera_id', 'CAM-001'),
            'anomalies': data.get('anomalies', [])
        }
        crowd_data_history.append(entry)
        
        # Update heatmap data
        zone = entry['zone']
        heatmap_data[zone]['density'].append(entry['density'])
        heatmap_data[zone]['timestamps'].append(entry['timestamp'])
        
        return entry
    
    def get_real_time_metrics(self):
        """Get current real-time metrics across all zones"""
        if not crowd_data_history:
            return self._empty_metrics()
        
        # Get latest data for each zone
        latest_by_zone = {}
        for entry in reversed(crowd_data_history):
            zone = entry['zone']
            if zone not in latest_by_zone:
                latest_by_zone[zone] = entry
        
        # Calculate aggregated metrics
        total_people = sum(e['person_count'] for e in latest_by_zone.values())
        avg_density = np.mean([e['density'] for e in latest_by_zone.values()])
        max_risk_zone = max(latest_by_zone.values(), key=lambda x: x['risk_score'])
        
        # Count risk levels
        risk_distribution = {'LOW': 0, 'MEDIUM': 0, 'HIGH': 0, 'CRITICAL': 0}
        for entry in latest_by_zone.values():
            risk_distribution[entry['risk_level']] += 1
        
        return {
            'timestamp': datetime.now().isoformat(),
            'total_people': total_people,
            'average_density': round(avg_density, 3),
            'monitored_zones': len(latest_by_zone),
            'highest_risk_zone': {
                'zone': max_risk_zone['zone'],
                'zone_name': self.zone_names.get(max_risk_zone['zone'], 'Unknown'),
                'risk_level': max_risk_zone['risk_level'],
                'risk_score': max_risk_zone['risk_score'],
                'person_count': max_risk_zone['person_count']
            },
            'risk_distribution': risk_distribution,
            'zones': [
                {
                    'zone': zone,
                    'zone_name': self.zone_names.get(zone, 'Unknown'),
                    'person_count': data['person_count'],
                    'density': data['density'],
                    'risk_level': data['risk_level']
                }
                for zone, data in latest_by_zone.items()
            ]
        }
    
    def get_historical_trends(self, hours=24):
        """Get historical trend data for charts"""
        if not crowd_data_history:
            return {'timestamps': [], 'person_counts': [], 'densities': [], 'risk_scores': []}
        
        # Filter data by time range
        time_threshold = datetime.now() - timedelta(hours=hours)
        filtered_data = [
            entry for entry in crowd_data_history
            if datetime.fromisoformat(entry['timestamp']) > time_threshold
        ]
        
        if not filtered_data:
            return {'timestamps': [], 'person_counts': [], 'densities': [], 'risk_scores': []}
        
        # Group by time intervals (every 5 minutes)
        interval_data = defaultdict(lambda: {'counts': [], 'densities': [], 'risks': []})
        
        for entry in filtered_data:
            timestamp = datetime.fromisoformat(entry['timestamp'])
            # Round to nearest 5 minutes
            interval = timestamp.replace(second=0, microsecond=0)
            interval = interval.replace(minute=(interval.minute // 5) * 5)
            
            interval_key = interval.isoformat()
            interval_data[interval_key]['counts'].append(entry['person_count'])
            interval_data[interval_key]['densities'].append(entry['density'])
            interval_data[interval_key]['risks'].append(entry['risk_score'])
        
        # Calculate averages for each interval
        timestamps = sorted(interval_data.keys())
        person_counts = [np.mean(interval_data[ts]['counts']) for ts in timestamps]
        densities = [np.mean(interval_data[ts]['densities']) for ts in timestamps]
        risk_scores = [np.mean(interval_data[ts]['risks']) for ts in timestamps]
        
        return {
            'timestamps': timestamps,
            'person_counts': [int(c) for c in person_counts],
            'densities': [round(d, 3) for d in densities],
            'risk_scores': [round(r, 3) for r in risk_scores],
            'interval_minutes': 5
        }
    
    def get_heatmap_data(self, zone=None):
        """Get density heatmap data for visualization"""
        if zone:
            zones_to_process = [zone] if zone in heatmap_data else []
        else:
            zones_to_process = list(heatmap_data.keys())
        
        heatmap = []
        for zone_id in zones_to_process:
            zone_data = heatmap_data[zone_id]
            if zone_data['density']:
                # Get recent data (last 100 points)
                recent_density = zone_data['density'][-100:]
                avg_density = np.mean(recent_density)
                max_density = np.max(recent_density)
                
                heatmap.append({
                    'zone': zone_id,
                    'zone_name': self.zone_names.get(zone_id, 'Unknown'),
                    'average_density': round(avg_density, 3),
                    'max_density': round(max_density, 3),
                    'data_points': len(recent_density),
                    'risk_level': self._density_to_risk(avg_density)
                })
        
        return sorted(heatmap, key=lambda x: x['average_density'], reverse=True)
    
    def get_anomaly_report(self, hours=24):
        """Generate anomaly detection report"""
        time_threshold = datetime.now() - timedelta(hours=hours)
        
        anomaly_counts = defaultdict(int)
        anomaly_details = []
        
        for entry in crowd_data_history:
            if datetime.fromisoformat(entry['timestamp']) > time_threshold:
                for anomaly in entry.get('anomalies', []):
                    anomaly_type = anomaly.get('type', 'UNKNOWN')
                    anomaly_counts[anomaly_type] += 1
                    
                    if len(anomaly_details) < 50:  # Limit to 50 most recent
                        anomaly_details.append({
                            'timestamp': entry['timestamp'],
                            'type': anomaly_type,
                            'severity': anomaly.get('severity', 0),
                            'description': anomaly.get('description', ''),
                            'zone': entry['zone'],
                            'zone_name': self.zone_names.get(entry['zone'], 'Unknown')
                        })
        
        return {
            'time_period_hours': hours,
            'total_anomalies': sum(anomaly_counts.values()),
            'by_type': dict(anomaly_counts),
            'recent_anomalies': sorted(anomaly_details, 
                                      key=lambda x: x['timestamp'], 
                                      reverse=True)[:20]
        }
    
    def get_peak_times_analysis(self):
        """Analyze peak crowd times"""
        if not crowd_data_history:
            return {'peak_hours': [], 'analysis': 'Insufficient data'}
        
        # Group by hour of day
        hourly_data = defaultdict(list)
        
        for entry in crowd_data_history:
            timestamp = datetime.fromisoformat(entry['timestamp'])
            hour = timestamp.hour
            hourly_data[hour].append(entry['person_count'])
        
        # Calculate average for each hour
        hourly_averages = {
            hour: np.mean(counts) 
            for hour, counts in hourly_data.items()
        }
        
        # Sort by crowd size
        sorted_hours = sorted(hourly_averages.items(), key=lambda x: x[1], reverse=True)
        
        peak_hours = [
            {
                'hour': hour,
                'time_range': f"{hour:02d}:00 - {(hour+1)%24:02d}:00",
                'average_people': int(avg_count),
                'is_peak': idx < 3  # Top 3 hours
            }
            for idx, (hour, avg_count) in enumerate(sorted_hours)
        ]
        
        return {
            'peak_hours': peak_hours,
            'busiest_hour': peak_hours[0] if peak_hours else None,
            'quietest_hour': peak_hours[-1] if peak_hours else None
        }
    
    def get_zone_comparison(self):
        """Compare crowd metrics across zones"""
        zone_stats = {}
        
        for zone, data in heatmap_data.items():
            if data['density']:
                densities = data['density']
                zone_stats[zone] = {
                    'zone': zone,
                    'zone_name': self.zone_names.get(zone, 'Unknown'),
                    'average_density': round(np.mean(densities), 3),
                    'max_density': round(np.max(densities), 3),
                    'min_density': round(np.min(densities), 3),
                    'std_deviation': round(np.std(densities), 3),
                    'volatility': 'HIGH' if np.std(densities) > 0.2 else 'LOW'
                }
        
        return sorted(zone_stats.values(), 
                     key=lambda x: x['average_density'], 
                     reverse=True)
    
    def generate_event_summary(self):
        """Generate comprehensive event summary report"""
        if not crowd_data_history:
            return {'error': 'No data available'}
        
        all_data = list(crowd_data_history)
        
        # Calculate overall statistics
        total_entries = len(all_data)
        person_counts = [e['person_count'] for e in all_data]
        densities = [e['density'] for e in all_data]
        risk_scores = [e['risk_score'] for e in all_data]
        
        # Count risk occurrences
        risk_counts = defaultdict(int)
        for entry in all_data:
            risk_counts[entry['risk_level']] += 1
        
        # Get time range
        timestamps = [datetime.fromisoformat(e['timestamp']) for e in all_data]
        duration = (max(timestamps) - min(timestamps)).total_seconds() / 3600  # hours
        
        return {
            'event_duration_hours': round(duration, 2),
            'total_data_points': total_entries,
            'crowd_statistics': {
                'peak_crowd': int(np.max(person_counts)),
                'average_crowd': int(np.mean(person_counts)),
                'minimum_crowd': int(np.min(person_counts)),
                'total_person_hours': int(np.sum(person_counts) * (duration / total_entries))
            },
            'density_statistics': {
                'max_density': round(np.max(densities), 3),
                'average_density': round(np.mean(densities), 3),
                'min_density': round(np.min(densities), 3)
            },
            'risk_analysis': {
                'average_risk_score': round(np.mean(risk_scores), 3),
                'max_risk_score': round(np.max(risk_scores), 3),
                'risk_level_distribution': dict(risk_counts),
                'high_risk_percentage': round(
                    (risk_counts['HIGH'] + risk_counts['CRITICAL']) / total_entries * 100, 2
                )
            },
            'generated_at': datetime.now().isoformat()
        }
    
    def _density_to_risk(self, density):
        """Convert density to risk level"""
        if density >= 0.8:
            return 'CRITICAL'
        elif density >= 0.6:
            return 'HIGH'
        elif density >= 0.4:
            return 'MEDIUM'
        return 'LOW'
    
    def _empty_metrics(self):
        """Return empty metrics structure"""
        return {
            'timestamp': datetime.now().isoformat(),
            'total_people': 0,
            'average_density': 0,
            'monitored_zones': 0,
            'highest_risk_zone': None,
            'risk_distribution': {'LOW': 0, 'MEDIUM': 0, 'HIGH': 0, 'CRITICAL': 0},
            'zones': []
        }


# Initialize analytics engine
analytics_engine = AnalyticsEngine()


# ==================== ROUTES ====================

@analytics_bp.route('/realtime', methods=['GET'])
def get_realtime_metrics():
    """
    GET /api/analytics/realtime
    Get current real-time metrics across all zones
    """
    try:
        metrics = analytics_engine.get_real_time_metrics()
        return jsonify({
            'success': True,
            'data': metrics
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@analytics_bp.route('/trends', methods=['GET'])
def get_historical_trends():
    """
    GET /api/analytics/trends
    Get historical trend data for charts
    Query param: hours (default: 24)
    """
    try:
        hours = int(request.args.get('hours', 24))
        trends = analytics_engine.get_historical_trends(hours)
        
        return jsonify({
            'success': True,
            'time_range_hours': hours,
            'data': trends
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@analytics_bp.route('/heatmap', methods=['GET'])
def get_heatmap():
    """
    GET /api/analytics/heatmap
    Get density heatmap data
    Query param: zone (optional)
    """
    try:
        zone = request.args.get('zone')
        heatmap = analytics_engine.get_heatmap_data(zone)
        
        return jsonify({
            'success': True,
            'data': heatmap
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@analytics_bp.route('/anomalies', methods=['GET'])
def get_anomaly_report():
    """
    GET /api/analytics/anomalies
    Get anomaly detection report
    Query param: hours (default: 24)
    """
    try:
        hours = int(request.args.get('hours', 24))
        report = analytics_engine.get_anomaly_report(hours)
        
        return jsonify({
            'success': True,
            'report': report
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@analytics_bp.route('/peak-times', methods=['GET'])
def get_peak_times():
    """
    GET /api/analytics/peak-times
    Analyze peak crowd times
    """
    try:
        analysis = analytics_engine.get_peak_times_analysis()
        
        return jsonify({
            'success': True,
            'analysis': analysis
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@analytics_bp.route('/zones/comparison', methods=['GET'])
def get_zone_comparison():
    """
    GET /api/analytics/zones/comparison
    Compare metrics across different zones
    """
    try:
        comparison = analytics_engine.get_zone_comparison()
        
        return jsonify({
            'success': True,
            'zones': comparison
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@analytics_bp.route('/summary', methods=['GET'])
def get_event_summary():
    """
    GET /api/analytics/summary
    Generate comprehensive event summary report
    """
    try:
        summary = analytics_engine.generate_event_summary()
        
        return jsonify({
            'success': True,
            'summary': summary
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@analytics_bp.route('/store', methods=['POST'])
def store_data():
    """
    POST /api/analytics/store
    Store new crowd monitoring data
    Body: {person_count, density, risk_level, risk_score, zone, camera_id, anomalies}
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400
        
        entry = analytics_engine.store_crowd_data(data)
        
        return jsonify({
            'success': True,
            'message': 'Data stored successfully',
            'entry': entry
        }), 201
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@analytics_bp.route('/export', methods=['GET'])
def export_data():
    """
    GET /api/analytics/export
    Export all analytics data as JSON
    Query param: format (json/csv)
    """
    try:
        export_format = request.args.get('format', 'json')
        
        if export_format == 'json':
            data = {
                'exported_at': datetime.now().isoformat(),
                'total_records': len(crowd_data_history),
                'data': list(crowd_data_history)
            }
            return jsonify(data), 200
        else:
            return jsonify({
                'success': False,
                'error': 'Only JSON format supported currently'
            }), 400
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@analytics_bp.route('/dashboard-stats', methods=['GET'])
def get_dashboard_stats():
    """
    GET /api/analytics/dashboard-stats
    Get aggregated stats for dashboard display
    """
    try:
        realtime = analytics_engine.get_real_time_metrics()
        anomaly_report = analytics_engine.get_anomaly_report(hours=1)
        
        stats = {
            'timestamp': datetime.now().isoformat(),
            'current_crowd': realtime['total_people'],
            'average_density': realtime['average_density'],
            'active_zones': realtime['monitored_zones'],
            'risk_status': realtime['highest_risk_zone']['risk_level'] if realtime['highest_risk_zone'] else 'LOW',
            'recent_anomalies': anomaly_report['total_anomalies'],
            'zones_at_risk': sum(1 for z in realtime['zones'] if z['risk_level'] in ['HIGH', 'CRITICAL'])
        }
        
        return jsonify({
            'success': True,
            'stats': stats
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@analytics_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'success': True,
        'service': 'analytics',
        'status': 'healthy',
        'data_points': len(crowd_data_history),
        'timestamp': datetime.now().isoformat()
    }), 200


# Export the blueprint and engine
__all__ = ['analytics_bp', 'analytics_engine']