import cv2
import numpy as np
import pytest
import os
from models.crowd_detection import CrowdDetector
import time

def create_test_scene():
    """Create a test scene with simulated people"""
    # Create a background
    image = np.ones((480, 640, 3), dtype=np.uint8) * 255
    
    # Add some background elements
    cv2.rectangle(image, (0, 380), (640, 480), (120, 120, 120), -1)  # Ground
    cv2.rectangle(image, (100, 50), (200, 200), (200, 200, 200), -1)  # Building
    cv2.rectangle(image, (400, 100), (500, 300), (180, 180, 180), -1)  # Building
    
    # Add simulated people (dark rectangles with head circles)
    people_positions = [
        (50, 300), (150, 350), (250, 320), (350, 340),
        (450, 330), (100, 250), (300, 280), (400, 260)
    ]
    
    for x, y in people_positions:
        # Body (make it more person-like)
        cv2.rectangle(image, (x, y), (x+30, y+60), (60, 60, 60), -1)
        # Head
        cv2.circle(image, (x+15, y-5), 10, (60, 60, 60), -1)
        # Add some detail
        cv2.line(image, (x+15, y+60), (x+15, y+80), (60, 60, 60), 2)  # Legs
    
    return image

def test_crowd_detection():
    print("Creating test scene...")
    image = create_test_scene()
    cv2.imwrite('test_scene.jpg', image)
    
    try:
        print("\nInitializing crowd detector...")
        detector = CrowdDetector()
        
        print("\nProcessing scene...")
        # Process the scene
        results = detector.detect_crowd(image)
        
        # Draw detections
        annotated_frame = detector.draw_detections(image.copy(), results['detections'])
        cv2.imwrite('crowd_detection_result.jpg', annotated_frame)
        
        print("\nResults:")
        print(f"✓ People detected: {results['count']}")
        print(f"✓ Crowd density: {results['density']}%")
        print(f"✓ Number of detections: {len(results['detections'])}")
        
        # Print detection confidences
        if results['detections']:
            print("\nDetection confidences:")
            for i, det in enumerate(results['detections'], 1):
                print(f"  Person {i}: {det['confidence']:.2f}")
        
        print("\nOutput files:")
        print("✓ Original scene: test_scene.jpg")
        print("✓ Detection result: crowd_detection_result.jpg")
        
        # Add assertions instead of return
        assert results is not None, "Results should not be None"
        assert isinstance(results, dict), "Results should be a dictionary"
        assert 'count' in results, "Results should contain 'count'"
        assert 'density' in results, "Results should contain 'density'"
        assert 'detections' in results, "Results should contain 'detections'"
        
    except Exception as e:
        pytest.fail(f"Error during testing: {str(e)}")
    
    finally:
        # Clean up test files
        for file in ['test_scene.jpg', 'crowd_detection_result.jpg', 'test_crowd.jpg', 'detected_crowd.jpg']:
            if os.path.exists(file):
                os.remove(file)

if __name__ == '__main__':
    print("=== Crowd Detection Test ===")
    start_time = time.time()
    test_crowd_detection()
    end_time = time.time()
    print(f"\nTest completed in {end_time - start_time:.2f} seconds")