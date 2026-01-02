import cv2
import numpy as np
from models.crowd_detection import CrowdDetector
import time
import datetime

def process_video_feed(source=0):  # 0 is usually the default webcam
    """
    Process video feed for crowd detection
    Args:
        source: Video source (0 for webcam, or video file path)
    """
    print("Initializing crowd detector...")
    detector = CrowdDetector()
    
    print(f"Opening video source: {'Webcam' if source == 0 else source}")
    cap = cv2.VideoCapture(source)
    
    if not cap.isOpened():
        print("Error: Could not open video source")
        return
    
    # Get video properties for saving
    frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    
    # Create output directory if it doesn't exist
    import os
    output_dir = os.path.join(os.path.dirname(__file__), 'output')
    os.makedirs(output_dir, exist_ok=True)
    
    # Create video writer
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    output_filename = os.path.join(output_dir, f'crowd_detection_{timestamp}.mp4')
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_filename, fourcc, fps, (frame_width, frame_height))
    
    print("\nProcessing video feed...")
    print("Press 'q' to quit")
    
    frame_count = 0
    start_time = time.time()
    
    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            frame_count += 1
            
            # Process frame
            results = detector.detect_crowd(frame)
            
            # Draw detections and info
            annotated_frame = detector.draw_detections(frame.copy(), results['detections'])
            
            # Add additional information
            current_fps = frame_count / (time.time() - start_time)
            cv2.putText(annotated_frame, f'FPS: {current_fps:.1f}',
                       (10, frame_height - 10), cv2.FONT_HERSHEY_SIMPLEX,
                       0.6, (0, 255, 0), 2)
            
            # Show the frame
            cv2.imshow('Crowd Detection', annotated_frame)
            
            # Save frame
            out.write(annotated_frame)
            
            # Break if 'q' is pressed
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
            
    except KeyboardInterrupt:
        print("\nStopping video processing...")
    
    finally:
        # Clean up
        cap.release()
        out.release()
        cv2.destroyAllWindows()
        
        # Print statistics
        elapsed_time = time.time() - start_time
        avg_fps = frame_count / elapsed_time
        print(f"\nProcessing complete:")
        print(f"✓ Processed {frame_count} frames")
        print(f"✓ Average FPS: {avg_fps:.1f}")
        print(f"✓ Total time: {elapsed_time:.1f} seconds")
        print(f"✓ Output saved as: {output_filename}")

if __name__ == '__main__':
    print("=== Real-time Crowd Detection ===")
    # You can replace 0 with a video file path
    process_video_feed(0)