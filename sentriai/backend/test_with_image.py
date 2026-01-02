import cv2
import numpy as np
import pytest
import os
from models.crowd_detection import CrowdDetector

@pytest.fixture
def image_path():
    """Create a test image and return its path"""
    test_image = "test_crowd.jpg"
    
    # Create a test image with some shapes that might look like people
    img = np.ones((480, 640, 3), dtype=np.uint8) * 255
    # Draw some rectangles that might look like people
    cv2.rectangle(img, (100, 100), (150, 200), (0, 0, 0), -1)
    cv2.rectangle(img, (200, 150), (250, 250), (0, 0, 0), -1)
    cv2.rectangle(img, (300, 100), (350, 200), (0, 0, 0), -1)
    cv2.imwrite(test_image, img)
    
    yield test_image
    
    # Cleanup after test
    if os.path.exists(test_image):
        os.remove(test_image)
    if os.path.exists("result_detection.jpg"):
        os.remove("result_detection.jpg")

def test_with_image(image_path):
    """Test crowd detection with an image file"""
    # Initialize detector
    detector = CrowdDetector()
    
    try:
        # Read the image
        image = cv2.imread(image_path)
        assert image is not None, f"Could not read image from {image_path}"
        
        # Process the image
        result = detector.detect_crowd(image)
        
        # Verify result structure
        assert result is not None, "Result should not be None"
        assert isinstance(result, dict), "Result should be a dictionary"
        assert 'count' in result, "Result should contain 'count'"
        assert 'density' in result, "Result should contain 'density'"
        
        # Draw detection results on the image
        annotated_image = detector.draw_detections(image.copy(), result['detections'])
        
        # Save the result
        output_path = "result_detection.jpg"
        cv2.imwrite(output_path, annotated_image)
        print(f"Detection results saved to {output_path}")
        print(f"Results: {result}")
        
    except Exception as e:
        pytest.fail(f"Error during testing: {str(e)}")