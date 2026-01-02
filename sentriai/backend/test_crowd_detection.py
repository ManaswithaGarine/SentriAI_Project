import cv2
import numpy as np
import os
import pytest
from models.crowd_detection import CrowdDetector

def test_crowd_detection():
    # Create a simple test image with a solid color
    test_image = np.ones((640, 480, 3), dtype=np.uint8) * 255
    
    # Save test image temporarily
    cv2.imwrite('test_frame.jpg', test_image)
    
    # Initialize detector
    detector = CrowdDetector()
    
    try:
        # Read the image
        image = cv2.imread('test_frame.jpg')
        assert image is not None, "Could not read test image"
        
        # Test with the image
        result = detector.detect_crowd(image)
        print("Test result:", result)
        
        # Add assertions instead of return True
        assert result is not None, "Result should not be None"
        assert isinstance(result, dict), "Result should be a dictionary"
        
    except Exception as e:
        pytest.fail(f"Error during testing: {str(e)}")
        
    finally:
        # Clean up
        if os.path.exists('test_frame.jpg'):
            os.remove('test_frame.jpg')

if __name__ == '__main__':
    print("Starting crowd detection test...")
    test_crowd_detection()
    print("Test completed successfully!")