import numpy as np
import time
from datetime import datetime
from collections import deque
import json

class RiskScorer:
    """
    Comprehensive risk scoring system that combines multiple factors:
    - Crowd density
    - Anomaly detection results
    - Historical patterns
    - Environmental factors
    - Time-based risk factors
    """
    
    def __init__(self):
        self.risk_history = deque(maxlen=100)
        self.alert_history = []
        self.baseline_density = 0.3  # Normal crowd density threshold
        
        # Risk weight factors
        self.weights = {
            'density': 0.30,
            'anomaly': 0.35,
            'flow': 0.15,
            'history': 0.10,
            'environmental': 0.10
        }
        
        # Risk thresholds
        self.thresholds = {
            'LOW': 0.3,
            'MEDIUM': 0.5,
            'HIGH': 0.7,
            'CRITICAL': 0.85
        }
    
    def calculate_density_risk(self, current_density, area_capacity=1.0):
        """
        Calculate risk based on crowd density
        - Uses density-to-capacity ratio
        - Considers safe crowd density standards
        """
        # Safe density: 0.0-0.4 (LOW), 0.4-0.6 (MEDIUM), 0.6-0.8 (HIGH), 0.8+ (CRITICAL)
        density_ratio = current_density / area_capacity
        
        if density_ratio >= 0.8:
            risk_score = 0.95
            level = "CRITICAL"
        elif density_ratio >= 0.6:
            risk_score = 0.75
            level = "HIGH"
        elif density_ratio >= 0.4:
            risk_score = 0.55
            level = "MEDIUM"
        else:
            risk_score = 0.25
            level = "LOW"
        
        return {
            'score': risk_score,
            'level': level,
            'density_ratio': density_ratio,
            'description': f"Crowd density at {density_ratio*100:.1f}% of capacity"
        }
    
    def calculate_anomaly_risk(self, anomaly_results):
        """
        Calculate risk based on detected anomalies
        """
        if not anomaly_results or not anomaly_results.get('anomalies'):
            return {'score': 0.0, 'level': 'LOW', 'anomalies': []}
        
        anomalies = anomaly_results['anomalies']
        
        # Weight different anomaly types
        anomaly_weights = {
            'PANIC_MOVEMENT': 1.0,
            'FIGHTING': 0.9,
            'DENSITY_SPIKE': 0.85,
            'FLOW_ANOMALY': 0.7,
            'OVERCROWDING_STATIC': 0.95
        }
        
        total_risk = 0
        weighted_anomalies = []
        
        for anomaly in anomalies:
            anomaly_type = anomaly.get('type', 'UNKNOWN')
            severity = anomaly.get('severity', 0.5)
            weight = anomaly_weights.get(anomaly_type, 0.5)
            
            anomaly_risk = severity * weight
            total_risk += anomaly_risk
            
            weighted_anomalies.append({
                'type': anomaly_type,
                'severity': severity,
                'weighted_risk': anomaly_risk,
                'description': anomaly.get('description', '')
            })
        
        # Normalize risk score (cap at 1.0)
        risk_score = min(total_risk, 1.0)
        
        # Determine level
        if risk_score >= 0.85:
            level = "CRITICAL"
        elif risk_score >= 0.7:
            level = "HIGH"
        elif risk_score >= 0.5:
            level = "MEDIUM"
        else:
            level = "LOW"
        
        return {
            'score': risk_score,
            'level': level,
            'anomalies': weighted_anomalies,
            'anomaly_count': len(anomalies)
        }
    
    def calculate_flow_risk(self, flow_data):
        """
        Calculate risk based on crowd flow patterns
        """
        if not flow_data or not flow_data.get('flow_anomaly'):
            return {'score': 0.1, 'level': 'LOW', 'pattern': 'NORMAL'}
        
        pattern = flow_data.get('pattern', 'NORMAL')
        severity = flow_data.get('severity', 0.5)
        
        if pattern == 'CHAOTIC':
            risk_score = 0.75
            level = "HIGH"
        elif pattern == 'BOTTLENECK':
            risk_score = 0.65
            level = "MEDIUM"
        else:
            risk_score = 0.3
            level = "LOW"
        
        return {
            'score': risk_score,
            'level': level,
            'pattern': pattern,
            'description': flow_data.get('description', '')
        }
    
    def calculate_historical_risk(self):
        """
        Calculate risk based on recent history trends
        """
        if len(self.risk_history) < 10:
            return {'score': 0.0, 'trend': 'STABLE'}
        
        recent_scores = list(self.risk_history)[-10:]
        older_scores = list(self.risk_history)[-20:-10] if len(self.risk_history) >= 20 else recent_scores
        
        recent_avg = np.mean(recent_scores)
        older_avg = np.mean(older_scores)
        
        # Calculate trend
        trend_change = recent_avg - older_avg
        
        if trend_change > 0.15:
            trend = "ESCALATING"
            risk_score = 0.7
        elif trend_change < -0.15:
            trend = "IMPROVING"
            risk_score = 0.2
        else:
            trend = "STABLE"
            risk_score = recent_avg * 0.3
        
        return {
            'score': risk_score,
            'trend': trend,
            'recent_average': recent_avg,
            'change_rate': trend_change
        }
    
    def calculate_environmental_risk(self, environmental_factors=None):
        """
        Calculate risk based on environmental conditions
        - Weather conditions
        - Time of day
        - Event type
        """
        if environmental_factors is None:
            environmental_factors = {}
        
        risk_score = 0.0
        factors = []
        
        # Weather impact
        weather = environmental_factors.get('weather', 'clear')
        if weather in ['rain', 'storm']:
            risk_score += 0.3
            factors.append("Adverse weather conditions")
        
        # Time of day (night events = higher risk)
        current_hour = datetime.now().hour
        if current_hour >= 21 or current_hour <= 5:
            risk_score += 0.2
            factors.append("Night time event")
        
        # Event type
        event_type = environmental_factors.get('event_type', 'general')
        high_risk_events = ['concert', 'sports', 'festival']
        if event_type in high_risk_events:
            risk_score += 0.15
            factors.append(f"High-risk event type: {event_type}")
        
        # Exit availability
        exit_blocked = environmental_factors.get('exits_blocked', False)
        if exit_blocked:
            risk_score += 0.4
            factors.append("Emergency exits blocked or restricted")
        
        return {
            'score': min(risk_score, 1.0),
            'factors': factors
        }
    
    def calculate_overall_risk(self, crowd_data, anomaly_data, flow_data=None, 
                              environmental_factors=None):
        """
        Calculate comprehensive risk score combining all factors
        Returns detailed risk assessment with actionable recommendations
        """
        # Calculate individual risk components
        density_risk = self.calculate_density_risk(
            crowd_data.get('density', 0),
            crowd_data.get('capacity', 1.0)
        )
        
        anomaly_risk = self.calculate_anomaly_risk(anomaly_data)
        
        flow_risk = self.calculate_flow_risk(flow_data) if flow_data else {'score': 0.0}
        
        historical_risk = self.calculate_historical_risk()
        
        environmental_risk = self.calculate_environmental_risk(environmental_factors)
        
        # Calculate weighted overall score
        overall_score = (
            density_risk['score'] * self.weights['density'] +
            anomaly_risk['score'] * self.weights['anomaly'] +
            flow_risk['score'] * self.weights['flow'] +
            historical_risk['score'] * self.weights['history'] +
            environmental_risk['score'] * self.weights['environmental']
        )
        
        # Store in history
        self.risk_history.append(overall_score)
        
        # Determine overall risk level
        if overall_score >= self.thresholds['CRITICAL']:
            risk_level = "CRITICAL"
            color_code = "#FF0000"
        elif overall_score >= self.thresholds['HIGH']:
            risk_level = "HIGH"
            color_code = "#FF6600"
        elif overall_score >= self.thresholds['MEDIUM']:
            risk_level = "MEDIUM"
            color_code = "#FFCC00"
        else:
            risk_level = "LOW"
            color_code = "#00FF00"
        
        # Generate recommendations
        recommendations = self.generate_recommendations(
            risk_level, density_risk, anomaly_risk, flow_risk
        )
        
        # Create comprehensive report
        risk_report = {
            'timestamp': datetime.now().isoformat(),
            'overall_score': round(overall_score, 3),
            'risk_level': risk_level,
            'color_code': color_code,
            'components': {
                'density': density_risk,
                'anomalies': anomaly_risk,
                'flow': flow_risk,
                'historical': historical_risk,
                'environmental': environmental_risk
            },
            'recommendations': recommendations,
            'alert_required': risk_level in ['HIGH', 'CRITICAL'],
            'evacuation_recommended': risk_level == 'CRITICAL',
            'person_count': crowd_data.get('person_count', 0)
        }
        
        # Log critical events
        if risk_level in ['HIGH', 'CRITICAL']:
            self.log_alert(risk_report)
        
        return risk_report
    
    def generate_recommendations(self, risk_level, density_risk, anomaly_risk, flow_risk):
        """
        Generate actionable recommendations based on risk assessment
        """
        recommendations = []
        
        if risk_level == "CRITICAL":
            recommendations.append("🚨 IMMEDIATE ACTION REQUIRED")
            recommendations.append("Activate emergency response protocol")
            recommendations.append("Consider crowd dispersal or evacuation")
            recommendations.append("Alert all security personnel and emergency services")
        
        if risk_level == "HIGH":
            recommendations.append("⚠️ High risk detected - increase monitoring")
            recommendations.append("Deploy additional security to affected areas")
            recommendations.append("Prepare for possible evacuation")
        
        # Density-specific recommendations
        if density_risk['density_ratio'] > 0.7:
            recommendations.append("🔴 Crowd density critical - stop entry to this zone")
            recommendations.append("Direct people to alternate routes/areas")
        
        # Anomaly-specific recommendations
        if anomaly_risk['anomaly_count'] > 0:
            for anomaly in anomaly_risk['anomalies']:
                if anomaly['type'] == 'PANIC_MOVEMENT':
                    recommendations.append("⚡ Panic detected - calm crowd via PA system")
                elif anomaly['type'] == 'FIGHTING':
                    recommendations.append("👮 Fighting detected - dispatch security immediately")
                elif anomaly['type'] == 'DENSITY_SPIKE':
                    recommendations.append("📊 Rapid crowd growth - implement entry control")
        
        # Flow-specific recommendations
        if flow_risk.get('pattern') == 'CHAOTIC':
            recommendations.append("🌀 Chaotic movement - establish clear pathways")
            recommendations.append("Use barriers to guide crowd flow")
        
        if not recommendations:
            recommendations.append("✅ Situation normal - continue monitoring")
        
        return recommendations
    
    def log_alert(self, risk_report):
        """
        Log high-risk events for post-event analysis
        """
        alert_entry = {
            'timestamp': risk_report['timestamp'],
            'risk_level': risk_report['risk_level'],
            'score': risk_report['overall_score'],
            'person_count': risk_report['person_count'],
            'components': risk_report['components']
        }
        self.alert_history.append(alert_entry)
    
    def get_alert_history(self, limit=50):
        """
        Retrieve recent alerts for dashboard display
        """
        return self.alert_history[-limit:]
    
    def export_analytics(self):
        """
        Export risk analytics for reporting
        """
        if len(self.risk_history) == 0:
            return {"error": "No data available"}
        
        risk_scores = list(self.risk_history)
        
        analytics = {
            'period': {
                'start': datetime.now().isoformat(),
                'duration_minutes': len(risk_scores) // 2  # Assuming 2 samples per minute
            },
            'statistics': {
                'average_risk': round(np.mean(risk_scores), 3),
                'max_risk': round(np.max(risk_scores), 3),
                'min_risk': round(np.min(risk_scores), 3),
                'std_deviation': round(np.std(risk_scores), 3)
            },
            'alerts': {
                'total_alerts': len(self.alert_history),
                'critical_alerts': sum(1 for a in self.alert_history if a['risk_level'] == 'CRITICAL'),
                'high_alerts': sum(1 for a in self.alert_history if a['risk_level'] == 'HIGH')
            },
            'trend': 'IMPROVING' if risk_scores[-1] < risk_scores[0] else 'WORSENING'
        }
        
        return analytics
    
    def reset(self):
        """Reset all scoring history"""
        self.risk_history.clear()
        self.alert_history.clear()


# Example usage and testing
if __name__ == "__main__":
    scorer = RiskScorer()
    
    # Simulate crowd scenario
    print("🎯 SentriAI Risk Scoring System - Test Mode\n")
    print("=" * 60)
    
    # Test Case 1: Normal crowd
    print("\n📊 Test Case 1: Normal Crowd Conditions")
    crowd_data = {'density': 0.3, 'capacity': 1.0, 'person_count': 150}
    anomaly_data = {'anomalies': []}
    
    result = scorer.calculate_overall_risk(crowd_data, anomaly_data)
    print(f"Risk Level: {result['risk_level']}")
    print(f"Risk Score: {result['overall_score']:.3f}")
    print(f"Recommendations: {result['recommendations'][0]}")
    
    # Test Case 2: High density with panic
    print("\n📊 Test Case 2: High Density + Panic Movement")
    crowd_data = {'density': 0.75, 'capacity': 1.0, 'person_count': 500}
    anomaly_data = {
        'anomalies': [
            {'type': 'PANIC_MOVEMENT', 'severity': 0.9, 'description': 'Sudden rapid movement'}
        ]
    }
    
    result = scorer.calculate_overall_risk(crowd_data, anomaly_data)
    print(f"Risk Level: {result['risk_level']}")
    print(f"Risk Score: {result['overall_score']:.3f}")
    print("Recommendations:")
    for rec in result['recommendations'][:3]:
        print(f"  - {rec}")
    
    # Test Case 3: Critical situation
    print("\n📊 Test Case 3: CRITICAL - Multiple Factors")
    crowd_data = {'density': 0.9, 'capacity': 1.0, 'person_count': 800}
    anomaly_data = {
        'anomalies': [
            {'type': 'PANIC_MOVEMENT', 'severity': 0.95, 'description': 'Stampede detected'},
            {'type': 'FIGHTING', 'severity': 0.8, 'description': 'Aggression detected'}
        ]
    }
    flow_data = {'flow_anomaly': True, 'pattern': 'CHAOTIC', 'severity': 0.9}
    env_factors = {'weather': 'storm', 'event_type': 'concert', 'exits_blocked': True}
    
    result = scorer.calculate_overall_risk(crowd_data, anomaly_data, flow_data, env_factors)
    print(f"Risk Level: {result['risk_level']}")
    print(f"Risk Score: {result['overall_score']:.3f}")
    print(f"Alert Required: {result['alert_required']}")
    print(f"Evacuation: {result['evacuation_recommended']}")
    print("Recommendations:")
    for rec in result['recommendations']:
        print(f"  - {rec}")
    
    # Export analytics
    print("\n📈 Analytics Summary:")
    analytics = scorer.export_analytics()
    print(json.dumps(analytics, indent=2))
    
    print("\n" + "=" * 60)
    print("✅ Risk scoring test complete!")