from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
import json
from collections import deque

# Create Blueprint for alerts routes
alerts_bp = Blueprint('alerts', __name__, url_prefix='/api/alerts')

# In-memory storage for alerts (replace with database in production)
alert_storage = deque(maxlen=500)  # Store last 500 alerts
active_alerts = []  # Currently active alerts
alert_subscribers = []  # WebSocket/SSE subscribers


class AlertManager:
    """Manages alert creation, storage, and retrieval"""
    
    def __init__(self):
        self.alert_id_counter = 1
        self.severity_levels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
        self.alert_types = [
            'OVERCROWDING', 'PANIC_MOVEMENT', 'FIGHTING', 
            'DENSITY_SPIKE', 'FLOW_ANOMALY', 'SYSTEM_WARNING'
        ]
    
    def create_alert(self, alert_data):
        """Create and store a new alert"""
        alert = {
            'id': self.alert_id_counter,
            'timestamp': datetime.now().isoformat(),
            'type': alert_data.get('type', 'SYSTEM_WARNING'),
            'severity': alert_data.get('severity', 'MEDIUM'),
            'title': alert_data.get('title', 'Alert'),
            'description': alert_data.get('description', ''),
            'location': alert_data.get('location', {}),
            'person_count': alert_data.get('person_count', 0),
            'risk_score': alert_data.get('risk_score', 0.0),
            'camera_id': alert_data.get('camera_id', 'CAM-001'),
            'status': 'ACTIVE',
            'acknowledged': False,
            'acknowledged_by': None,
            'resolved': False,
            'resolved_at': None,
            'recommendations': alert_data.get('recommendations', [])
        }
        
        self.alert_id_counter += 1
        alert_storage.append(alert)
        
        # Add to active alerts if severity is HIGH or CRITICAL
        if alert['severity'] in ['HIGH', 'CRITICAL']:
            active_alerts.append(alert)
        
        return alert
    
    def get_alerts(self, filters=None):
        """Retrieve alerts with optional filters"""
        alerts = list(alert_storage)
        
        if filters:
            # Filter by severity
            if 'severity' in filters:
                alerts = [a for a in alerts if a['severity'] == filters['severity']]
            
            # Filter by type
            if 'type' in filters:
                alerts = [a for a in alerts if a['type'] == filters['type']]
            
            # Filter by status
            if 'status' in filters:
                if filters['status'] == 'ACTIVE':
                    alerts = [a for a in alerts if not a['resolved']]
                elif filters['status'] == 'RESOLVED':
                    alerts = [a for a in alerts if a['resolved']]
            
            # Filter by time range
            if 'start_time' in filters and 'end_time' in filters:
                start = datetime.fromisoformat(filters['start_time'])
                end = datetime.fromisoformat(filters['end_time'])
                alerts = [
                    a for a in alerts 
                    if start <= datetime.fromisoformat(a['timestamp']) <= end
                ]
        
        # Sort by timestamp (newest first)
        alerts.sort(key=lambda x: x['timestamp'], reverse=True)
        return alerts
    
    def get_alert_by_id(self, alert_id):
        """Get specific alert by ID"""
        for alert in alert_storage:
            if alert['id'] == alert_id:
                return alert
        return None
    
    def acknowledge_alert(self, alert_id, user_id):
        """Mark alert as acknowledged"""
        alert = self.get_alert_by_id(alert_id)
        if alert:
            alert['acknowledged'] = True
            alert['acknowledged_by'] = user_id
            alert['acknowledged_at'] = datetime.now().isoformat()
            return alert
        return None
    
    def resolve_alert(self, alert_id, resolution_note=''):
        """Mark alert as resolved"""
        alert = self.get_alert_by_id(alert_id)
        if alert:
            alert['resolved'] = True
            alert['resolved_at'] = datetime.now().isoformat()
            alert['status'] = 'RESOLVED'
            alert['resolution_note'] = resolution_note
            
            # Remove from active alerts
            active_alerts[:] = [a for a in active_alerts if a['id'] != alert_id]
            return alert
        return None
    
    def get_statistics(self):
        """Get alert statistics"""
        all_alerts = list(alert_storage)
        
        # Count by severity
        severity_counts = {level: 0 for level in self.severity_levels}
        for alert in all_alerts:
            severity_counts[alert['severity']] += 1
        
        # Count by type
        type_counts = {atype: 0 for atype in self.alert_types}
        for alert in all_alerts:
            if alert['type'] in type_counts:
                type_counts[alert['type']] += 1
        
        # Active vs resolved
        active_count = sum(1 for a in all_alerts if not a['resolved'])
        resolved_count = sum(1 for a in all_alerts if a['resolved'])
        
        # Recent activity (last hour)
        one_hour_ago = datetime.now() - timedelta(hours=1)
        recent_alerts = [
            a for a in all_alerts 
            if datetime.fromisoformat(a['timestamp']) > one_hour_ago
        ]
        
        return {
            'total_alerts': len(all_alerts),
            'active_alerts': active_count,
            'resolved_alerts': resolved_count,
            'by_severity': severity_counts,
            'by_type': type_counts,
            'recent_hour': len(recent_alerts),
            'critical_active': sum(1 for a in active_alerts if a['severity'] == 'CRITICAL')
        }


# Initialize alert manager
alert_manager = AlertManager()


# ==================== ROUTES ====================

@alerts_bp.route('/', methods=['GET'])
def get_all_alerts():
    """
    GET /api/alerts
    Retrieve all alerts with optional filters
    Query params: severity, type, status, limit
    """
    try:
        filters = {}
        
        # Extract query parameters
        if request.args.get('severity'):
            filters['severity'] = request.args.get('severity').upper()
        
        if request.args.get('type'):
            filters['type'] = request.args.get('type').upper()
        
        if request.args.get('status'):
            filters['status'] = request.args.get('status').upper()
        
        # Get alerts
        alerts = alert_manager.get_alerts(filters)
        
        # Apply limit
        limit = int(request.args.get('limit', 50))
        alerts = alerts[:limit]
        
        return jsonify({
            'success': True,
            'count': len(alerts),
            'alerts': alerts
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@alerts_bp.route('/active', methods=['GET'])
def get_active_alerts():
    """
    GET /api/alerts/active
    Get all currently active (unresolved) alerts
    """
    try:
        active = [a for a in alert_storage if not a['resolved']]
        active.sort(key=lambda x: x['timestamp'], reverse=True)
        
        return jsonify({
            'success': True,
            'count': len(active),
            'alerts': active
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@alerts_bp.route('/critical', methods=['GET'])
def get_critical_alerts():
    """
    GET /api/alerts/critical
    Get all critical severity alerts (active only)
    """
    try:
        critical = [
            a for a in active_alerts 
            if a['severity'] == 'CRITICAL'
        ]
        
        return jsonify({
            'success': True,
            'count': len(critical),
            'alerts': critical
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@alerts_bp.route('/<int:alert_id>', methods=['GET'])
def get_alert_detail(alert_id):
    """
    GET /api/alerts/<id>
    Get details of a specific alert
    """
    try:
        alert = alert_manager.get_alert_by_id(alert_id)
        
        if not alert:
            return jsonify({
                'success': False,
                'error': 'Alert not found'
            }), 404
        
        return jsonify({
            'success': True,
            'alert': alert
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@alerts_bp.route('/create', methods=['POST'])
def create_new_alert():
    """
    POST /api/alerts/create
    Create a new alert
    Body: {type, severity, title, description, location, person_count, risk_score, camera_id, recommendations}
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400
        
        # Validate required fields
        if 'type' not in data or 'severity' not in data:
            return jsonify({
                'success': False,
                'error': 'Missing required fields: type, severity'
            }), 400
        
        # Create alert
        alert = alert_manager.create_alert(data)
        
        return jsonify({
            'success': True,
            'message': 'Alert created successfully',
            'alert': alert
        }), 201
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@alerts_bp.route('/<int:alert_id>/acknowledge', methods=['POST'])
def acknowledge_alert(alert_id):
    """
    POST /api/alerts/<id>/acknowledge
    Acknowledge an alert
    Body: {user_id}
    """
    try:
        data = request.get_json() or {}
        user_id = data.get('user_id', 'system')
        
        alert = alert_manager.acknowledge_alert(alert_id, user_id)
        
        if not alert:
            return jsonify({
                'success': False,
                'error': 'Alert not found'
            }), 404
        
        return jsonify({
            'success': True,
            'message': 'Alert acknowledged',
            'alert': alert
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@alerts_bp.route('/<int:alert_id>/resolve', methods=['POST'])
def resolve_alert(alert_id):
    """
    POST /api/alerts/<id>/resolve
    Resolve an alert
    Body: {resolution_note}
    """
    try:
        data = request.get_json() or {}
        resolution_note = data.get('resolution_note', 'Resolved by user')
        
        alert = alert_manager.resolve_alert(alert_id, resolution_note)
        
        if not alert:
            return jsonify({
                'success': False,
                'error': 'Alert not found'
            }), 404
        
        return jsonify({
            'success': True,
            'message': 'Alert resolved',
            'alert': alert
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@alerts_bp.route('/statistics', methods=['GET'])
def get_alert_statistics():
    """
    GET /api/alerts/statistics
    Get alert statistics and metrics
    """
    try:
        stats = alert_manager.get_statistics()
        
        return jsonify({
            'success': True,
            'statistics': stats
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@alerts_bp.route('/recent', methods=['GET'])
def get_recent_alerts():
    """
    GET /api/alerts/recent
    Get alerts from the last N minutes
    Query param: minutes (default: 60)
    """
    try:
        minutes = int(request.args.get('minutes', 60))
        time_threshold = datetime.now() - timedelta(minutes=minutes)
        
        recent = [
            a for a in alert_storage
            if datetime.fromisoformat(a['timestamp']) > time_threshold
        ]
        recent.sort(key=lambda x: x['timestamp'], reverse=True)
        
        return jsonify({
            'success': True,
            'count': len(recent),
            'time_range_minutes': minutes,
            'alerts': recent
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@alerts_bp.route('/bulk-resolve', methods=['POST'])
def bulk_resolve_alerts():
    """
    POST /api/alerts/bulk-resolve
    Resolve multiple alerts at once
    Body: {alert_ids: [1, 2, 3], resolution_note: "..."}
    """
    try:
        data = request.get_json()
        alert_ids = data.get('alert_ids', [])
        resolution_note = data.get('resolution_note', 'Bulk resolved')
        
        if not alert_ids:
            return jsonify({
                'success': False,
                'error': 'No alert IDs provided'
            }), 400
        
        resolved_alerts = []
        failed_ids = []
        
        for alert_id in alert_ids:
            alert = alert_manager.resolve_alert(alert_id, resolution_note)
            if alert:
                resolved_alerts.append(alert)
            else:
                failed_ids.append(alert_id)
        
        return jsonify({
            'success': True,
            'resolved_count': len(resolved_alerts),
            'failed_count': len(failed_ids),
            'failed_ids': failed_ids
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@alerts_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'success': True,
        'service': 'alerts',
        'status': 'healthy',
        'timestamp': datetime.now().isoformat()
    }), 200


# Export the blueprint and manager for use in main app
__all__ = ['alerts_bp', 'alert_manager']