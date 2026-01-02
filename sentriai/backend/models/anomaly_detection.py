import cv2
import numpy as np
from collections import deque
import time

class AnomalyDetector:
    """
    Detects anomalies in crowd behavior including:
    - Sudden rapid movements (panic/stampede)
    - Fighting or aggressive behavior
    - Unusual crowd flow patterns
    - Stationary overcrowding
    """
    
    def __init__(self):
        self.prev_frame = None
        self.motion_history = deque(maxlen=30)  # Store last 30 frames of motion
        self.density_history = deque(maxlen=50)
        self.anomaly_threshold = 0.7
        
    def detect_motion_anomaly(self, frame):
        """
        Detects sudden unusual motion patterns that might indicate panic
        Returns: dict with anomaly info
        """
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        gray = cv2.GaussianBlur(gray, (21, 21), 0)
        
        if self.prev_frame is None:
            self.prev_frame = gray
            return {"anomaly_detected": False, "type": None, "severity": 0}
        
        # Calculate frame difference
        frame_delta = cv2.absdiff(self.prev_frame, gray)
        thresh = cv2.threshold(frame_delta, 25, 255, cv2.THRESH_BINARY)[1]
        thresh = cv2.dilate(thresh, None, iterations=2)
        
        # Calculate motion intensity
        motion_intensity = np.sum(thresh) / (frame.shape[0] * frame.shape[1] * 255)
        self.motion_history.append(motion_intensity)
        
        # Detect anomalies
        anomaly_result = self._analyze_motion_pattern()
        
        self.prev_frame = gray
        return anomaly_result
    
    def _analyze_motion_pattern(self):
        """Analyze motion history to detect anomalies"""
        if len(self.motion_history) < 10:
            return {"anomaly_detected": False, "type": None, "severity": 0}
        
        recent_motion = list(self.motion_history)[-10:]
        avg_motion = np.mean(recent_motion)
        motion_variance = np.var(recent_motion)
        
        # Detect sudden spike in motion (possible panic)
        if avg_motion > 0.3 and motion_variance > 0.01:
            return {
                "anomaly_detected": True,
                "type": "PANIC_MOVEMENT",
                "severity": min(avg_motion * 3, 1.0),
                "description": "Sudden rapid crowd movement detected",
                "timestamp": time.time()
            }
        
        # Detect unusual stillness in high-density area
        if avg_motion < 0.05 and len(self.density_history) > 0:
            avg_density = np.mean(list(self.density_history)[-10:])
            if avg_density > 0.6:
                return {
                    "anomaly_detected": True,
                    "type": "OVERCROWDING_STATIC",
                    "severity": avg_density,
                    "description": "Dangerous static overcrowding detected",
                    "timestamp": time.time()
                }
        
        return {"anomaly_detected": False, "type": None, "severity": 0}
    
    def detect_fighting(self, frame, person_detections):
        """
        Detect potential fighting or aggressive behavior
        Uses optical flow and person proximity
        """
        if len(person_detections) < 2:
            return {"fighting_detected": False, "confidence": 0}
        
        # Convert to grayscale for optical flow
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        # Check for rapid erratic movements between close people
        fighting_score = 0
        
        for i, person1 in enumerate(person_detections):
            for person2 in person_detections[i+1:]:
                # Calculate distance between people
                x1, y1 = person1['center']
                x2, y2 = person2['center']
                distance = np.sqrt((x2-x1)**2 + (y2-y1)**2)
                
                # If people are very close and moving rapidly
                if distance < 100:  # pixels
                    motion1 = person1.get('motion_magnitude', 0)
                    motion2 = person2.get('motion_magnitude', 0)
                    
                    if motion1 > 0.5 or motion2 > 0.5:
                        fighting_score += 0.3
        
        fighting_detected = fighting_score > 0.6
        
        return {
            "fighting_detected": fighting_detected,
            "confidence": min(fighting_score, 1.0),
            "description": "Possible aggressive behavior detected" if fighting_detected else None
        }
    
    def detect_crowd_density_spike(self, current_density):
        """
        Detect sudden dangerous increases in crowd density
        """
        self.density_history.append(current_density)
        
        if len(self.density_history) < 20:
            return {"spike_detected": False, "rate_of_change": 0}
        
        # Calculate rate of density increase
        recent = list(self.density_history)[-10:]
        older = list(self.density_history)[-20:-10]
        
        recent_avg = np.mean(recent)
        older_avg = np.mean(older)
        
        rate_of_change = (recent_avg - older_avg) / older_avg if older_avg > 0 else 0
        
        # Alert if density increased by more than 40% in short time
        spike_detected = rate_of_change > 0.4 and recent_avg > 0.5
        
        return {
            "spike_detected": spike_detected,
            "rate_of_change": rate_of_change,
            "current_density": current_density,
            "severity": "HIGH" if spike_detected else "NORMAL",
            "description": "Rapid crowd accumulation detected" if spike_detected else None
        }
    
    def analyze_crowd_flow(self, frame, person_detections):
        """
        Analyze crowd movement patterns to detect bottlenecks or unusual flow
        """
        if len(person_detections) < 5:
            return {"flow_anomaly": False, "pattern": "NORMAL"}
        
        # Extract movement vectors
        movements = []
        for person in person_detections:
            if 'velocity' in person:
                movements.append(person['velocity'])
        
        if len(movements) < 3:
            return {"flow_anomaly": False, "pattern": "NORMAL"}
        
        movements = np.array(movements)
        
        # Check for opposing flows (people moving in opposite directions)
        mean_direction = np.mean(movements, axis=0)
        direction_variance = np.var(movements, axis=0)
        
        # High variance = chaotic movement
        if np.sum(direction_variance) > 5000:
            return {
                "flow_anomaly": True,
                "pattern": "CHAOTIC",
                "description": "Disorganized crowd movement detected",
                "severity": 0.8
            }
        
        return {"flow_anomaly": False, "pattern": "NORMAL"}
    
    def comprehensive_analysis(self, frame, person_detections, current_density):
        """
        Run all anomaly detection methods and return comprehensive report
        """
        results = {
            "timestamp": time.time(),
            "anomalies": [],
            "overall_risk": "LOW"
        }
        
        # Motion anomaly detection
        motion_result = self.detect_motion_anomaly(frame)
        if motion_result["anomaly_detected"]:
            results["anomalies"].append(motion_result)
        
        # Fighting detection
        fight_result = self.detect_fighting(frame, person_detections)
        if fight_result["fighting_detected"]:
            results["anomalies"].append({
                "type": "FIGHTING",
                "severity": fight_result["confidence"],
                "description": fight_result["description"]
            })
        
        # Density spike detection
        density_result = self.detect_crowd_density_spike(current_density)
        if density_result["spike_detected"]:
            results["anomalies"].append({
                "type": "DENSITY_SPIKE",
                "severity": 0.9,
                "description": density_result["description"]
            })
        
        # Crowd flow analysis
        flow_result = self.analyze_crowd_flow(frame, person_detections)
        if flow_result["flow_anomaly"]:
            results["anomalies"].append({
                "type": "FLOW_ANOMALY",
                "severity": flow_result.get("severity", 0.7),
                "description": flow_result["description"]
            })
        
        # Calculate overall risk
        if len(results["anomalies"]) > 0:
            max_severity = max([a["severity"] for a in results["anomalies"]])
            if max_severity > 0.8 or len(results["anomalies"]) >= 2:
                results["overall_risk"] = "CRITICAL"
            elif max_severity > 0.5:
                results["overall_risk"] = "HIGH"
            else:
                results["overall_risk"] = "MEDIUM"
        
        return results
    
    def reset(self):
        """Reset detection history"""
        self.prev_frame = None
        self.motion_history.clear()
        self.density_history.clear()


# Example usage
if __name__ == "__main__":
    detector = AnomalyDetector()
    
    # Test with webcam
    cap = cv2.VideoCapture(0)
    
    print("Starting anomaly detection... Press 'q' to quit")
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        
        # Simulate person detections (in real use, get from YOLO)
        mock_detections = [
            {"center": (100, 100), "motion_magnitude": 0.3},
            {"center": (150, 120), "motion_magnitude": 0.4}
        ]
        
        # Run detection
        result = detector.comprehensive_analysis(frame, mock_detections, 0.6)
        
        # Display results
        cv2.putText(frame, f"Risk: {result['overall_risk']}", 
                   (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
        
        if result["anomalies"]:
            y_pos = 70
            for anomaly in result["anomalies"]:
                text = f"{anomaly['type']}: {anomaly['description']}"
                cv2.putText(frame, text, (10, y_pos), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255), 1)
                y_pos += 30
        
        cv2.imshow('Anomaly Detection', frame)
        
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    
    cap.release()
    cv2.destroyAllWindows()