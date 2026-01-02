# crowd_detection.py
import cv2
import numpy as np
import time

class CrowdDetector:
    def __init__(self):
        """
        Initialize the crowd detection system using HOG detector
        """
        self.hog = cv2.HOGDescriptor()
        self.hog.setSVMDetector(cv2.HOGDescriptor_getDefaultPeopleDetector())
        
        # Detection settings
        self.confidence_threshold = 0.5
        self.person_class_id = 0  # COCO dataset person class
        
    def detect_crowd(self, frame):
        """
        Detect people in frame and calculate crowd metrics
        Args:
            frame: Input image/frame
        Returns:
            dict: Detection results with count, density, bounding boxes
        """
        # Preprocess frame
        frame = cv2.resize(frame, (640, 480))  # Resize for consistent detection
        frame_gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        frame_gray = cv2.equalizeHist(frame_gray)  # Improve contrast
        
        # Run HOG detection with optimized parameters for real-time
        boxes, weights = self.hog.detectMultiScale(
            frame_gray,
            winStride=(4, 4),    # Smaller stride for better detection
            padding=(8, 8),      # Smaller padding for faster processing
            scale=1.05,          # Slightly larger scale step for speed
        )
        
        # Extract detections with non-maximum suppression
        if len(boxes) > 0:
            # Convert boxes to the format required by NMS
            boxes_nms = np.array([[x, y, x + w, y + h] for (x, y, w, h) in boxes])
            
            # Create detections list directly (skip NMS for now)
            detections = []
            for box, confidence in zip(boxes, weights):
                x, y, w, h = box
                detections.append({
                    'bbox': [int(x), int(y), int(x+w), int(y+h)],
                    'confidence': float(confidence)
                })
        else:
            detections = []
        
        # Calculate metrics
        people_count = len(detections)
        frame_area = frame.shape[0] * frame.shape[1]
        
        # Calculate density (people per 1000 sq pixels)
        density = (people_count / frame_area) * 1000 if frame_area > 0 else 0
        
        # Normalize density to 0-100 scale
        density_percentage = min(100, density * 10)
        
        return {
            'count': people_count,
            'density': round(density_percentage, 2),
            'detections': detections,
            'frame_shape': frame.shape
        }
    
    def draw_detections(self, frame, detections):
        """
        Draw enhanced visualization with bounding boxes and crowd info
        Args:
            frame: Input frame
            detections: List of detection results
        Returns:
            frame: Annotated frame
        """
        # Create a copy for overlay
        overlay = frame.copy()
        h, w = frame.shape[:2]
        
        # Draw detection boxes
        for detection in detections:
            bbox = detection['bbox']
            confidence = detection['confidence']
            
            # Calculate color based on confidence (red to green)
            color = (0, int(255 * min(confidence, 1.0)), int(255 * (1 - min(confidence, 1.0))))
            
            # Draw filled rectangle with transparency
            cv2.rectangle(overlay, 
                         (bbox[0], bbox[1]), 
                         (bbox[2], bbox[3]), 
                         color, -1)
            
            # Draw border with thickness based on confidence
            thickness = max(1, int(confidence * 3))
            cv2.rectangle(frame, 
                         (bbox[0], bbox[1]), 
                         (bbox[2], bbox[3]), 
                         color, thickness)
            
            # Draw confidence label with background
            label = f"Person {confidence:.2f}"
            (label_w, label_h), _ = cv2.getTextSize(label, 
                                                   cv2.FONT_HERSHEY_SIMPLEX,
                                                   0.5, 2)
            # Background for label
            cv2.rectangle(frame,
                         (bbox[0], bbox[1] - 25),
                         (bbox[0] + label_w + 5, bbox[1]),
                         (0, 0, 0), -1)
            # Label text
            cv2.putText(frame, label,
                       (bbox[0] + 2, bbox[1] - 7),
                       cv2.FONT_HERSHEY_SIMPLEX,
                       0.5, color, 2)
        
        # Add transparency to detection overlay
        cv2.addWeighted(overlay, 0.2, frame, 0.8, 0, frame)
        
        # Calculate metrics
        people_count = len(detections)
        density = (people_count / (w * h)) * 10000  # per 100x100 px
        risk_level = "LOW" if density < 1 else "MEDIUM" if density < 2 else "HIGH"
        
        # Draw info panel background
        panel_h = 120
        panel_w = 250
        cv2.rectangle(frame, (10, 10), (10 + panel_w, 10 + panel_h), (0, 0, 0), -1)
        cv2.rectangle(frame, (10, 10), (10 + panel_w, 10 + panel_h), (255, 255, 255), 1)
        
        # Draw metrics
        y = 35
        cv2.putText(frame, f"People Count: {people_count}",
                   (20, y), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
        
        y += 25
        cv2.putText(frame, f"Density: {density:.1f}/100px²",
                   (20, y), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
        
        y += 25
        risk_color = {
            "LOW": (0, 255, 0),
            "MEDIUM": (0, 255, 255),
            "HIGH": (0, 0, 255)
        }[risk_level]
        cv2.putText(frame, f"Risk Level: {risk_level}",
                   (20, y), cv2.FONT_HERSHEY_SIMPLEX, 0.6, risk_color, 2)
        
        # Add timestamp
        y += 25
        cv2.putText(frame, time.strftime("%Y-%m-%d %H:%M:%S"),
                   (20, y), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
        
        return frame
    
    def detect_anomaly(self, crowd_data):
        """
        Detect crowd anomalies based on metrics
        Args:
            crowd_data: Dictionary with crowd metrics
        Returns:
            dict: Anomaly detection results
        """
        alerts = []
        severity = 'normal'
        
        # Check overcrowding
        if crowd_data['density'] > 80:
            alerts.append('Critical overcrowding detected')
            severity = 'critical'
        elif crowd_data['density'] > 60:
            alerts.append('High crowd density')
            severity = 'high'
        elif crowd_data['density'] > 40:
            alerts.append('Elevated crowd levels')
            severity = 'medium'
        
        # Check crowd count
        if crowd_data['count'] > 100:
            alerts.append('Large crowd detected')
        
        return {
            'has_alert': len(alerts) > 0,
            'severity': severity,
            'alerts': alerts,
            'timestamp': time.time()
        }


def process_video(video_source=0):
    """
    Process video stream for crowd detection
    Args:
        video_source: Video file path or camera index (0 for webcam)
    """
    # Initialize detector
    detector = CrowdDetector()
    
    # Open video capture
    cap = cv2.VideoCapture(video_source)
    
    if not cap.isOpened():
        print("❌ Error: Could not open video source")
        return
    
    print("✅ Video capture started. Press 'q' to quit.")
    
    frame_count = 0
    start_time = time.time()
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        
        frame_count += 1
        
        # Detect crowd every frame (or skip frames for performance)
        if frame_count % 1 == 0:  # Process every frame
            # Detect crowd
            crowd_data = detector.detect_crowd(frame)
            
            # Check for anomalies
            anomaly_result = detector.detect_anomaly(crowd_data)
            
            # Draw detections
            annotated_frame = detector.draw_detections(frame, crowd_data['detections'])
            
            # Display metrics
            cv2.putText(annotated_frame, 
                       f"Count: {crowd_data['count']}", 
                       (10, 30),
                       cv2.FONT_HERSHEY_SIMPLEX, 
                       1, (0, 255, 255), 2)
            
            cv2.putText(annotated_frame, 
                       f"Density: {crowd_data['density']:.1f}%", 
                       (10, 70),
                       cv2.FONT_HERSHEY_SIMPLEX, 
                       1, (0, 255, 255), 2)
            
            # Display alerts
            if anomaly_result['has_alert']:
                color = (0, 0, 255) if anomaly_result['severity'] == 'critical' else (0, 165, 255)
                cv2.putText(annotated_frame, 
                           f"ALERT: {anomaly_result['severity'].upper()}", 
                           (10, 110),
                           cv2.FONT_HERSHEY_SIMPLEX, 
                           1, color, 2)
            
            # Calculate FPS
            elapsed_time = time.time() - start_time
            fps = frame_count / elapsed_time if elapsed_time > 0 else 0
            cv2.putText(annotated_frame, 
                       f"FPS: {fps:.1f}", 
                       (10, 150),
                       cv2.FONT_HERSHEY_SIMPLEX, 
                       0.7, (255, 255, 0), 2)
            
            # Show frame
            cv2.imshow('Crowd Detection', annotated_frame)
        
        # Exit on 'q' key
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    
    # Cleanup
    cap.release()
    cv2.destroyAllWindows()
    print("✅ Video processing completed")


if __name__ == "__main__":
    # Test with webcam
    print("Starting crowd detection with webcam...")
    process_video(0)
    
    # Or test with video file:
    # process_video('path/to/your/video.mp4')