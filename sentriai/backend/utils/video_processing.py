import cv2
import numpy as np
from datetime import datetime
import threading
import queue
import time
from collections import deque
import base64


class VideoProcessor:
    """
    Handles video stream processing for crowd monitoring
    - Supports multiple camera sources (RTSP, USB, IP cameras)
    - Frame preprocessing and optimization
    - Video recording for incidents
    - Snapshot capture
    """
    
    def __init__(self, source=0, name="Camera-1"):
        """
        Initialize video processor
        :param source: Video source (0 for webcam, RTSP URL for IP camera)
        :param name: Camera identifier
        """
        self.source = source
        self.name = name
        self.cap = None
        self.is_running = False
        self.frame_queue = queue.Queue(maxsize=10)
        self.latest_frame = None
        self.fps = 0
        self.frame_count = 0
        self.recording = False
        self.video_writer = None
        
        # Performance optimization
        self.skip_frames = 1  # Process every Nth frame
        self.resize_width = 640  # Resize for faster processing
        self.resize_height = 480
        
        # Thread for capturing frames
        self.capture_thread = None
        
    def connect(self):
        """Connect to video source"""
        try:
            self.cap = cv2.VideoCapture(self.source)
            
            # Set camera properties for better performance
            self.cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
            self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, self.resize_width)
            self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, self.resize_height)
            
            if self.cap.isOpened():
                self.fps = self.cap.get(cv2.CAP_PROP_FPS) or 30
                print(f"✅ {self.name} connected - FPS: {self.fps}")
                return True
            else:
                print(f"❌ Failed to connect to {self.name}")
                return False
                
        except Exception as e:
            print(f"❌ Connection error for {self.name}: {str(e)}")
            return False
    
    def disconnect(self):
        """Disconnect from video source"""
        self.is_running = False
        if self.cap:
            self.cap.release()
        if self.video_writer:
            self.video_writer.release()
        print(f"🔌 {self.name} disconnected")
    
    def start_capture(self):
        """Start capturing frames in background thread"""
        if not self.cap or not self.cap.isOpened():
            if not self.connect():
                return False
        
        self.is_running = True
        self.capture_thread = threading.Thread(target=self._capture_loop, daemon=True)
        self.capture_thread.start()
        print(f"▶️ {self.name} capture started")
        return True
    
    def stop_capture(self):
        """Stop capturing frames"""
        self.is_running = False
        if self.capture_thread:
            self.capture_thread.join(timeout=2)
        print(f"⏹️ {self.name} capture stopped")
    
    def _capture_loop(self):
        """Background thread for capturing frames"""
        frame_counter = 0
        
        while self.is_running:
            try:
                ret, frame = self.cap.read()
                
                if not ret:
                    print(f"⚠️ {self.name}: Frame read failed")
                    time.sleep(0.1)
                    continue
                
                # Skip frames for performance
                frame_counter += 1
                if frame_counter % self.skip_frames != 0:
                    continue
                
                # Store latest frame
                self.latest_frame = frame.copy()
                self.frame_count += 1
                
                # Add to queue (non-blocking)
                if not self.frame_queue.full():
                    self.frame_queue.put(frame)
                
                # Record if enabled
                if self.recording and self.video_writer:
                    self.video_writer.write(frame)
                
            except Exception as e:
                print(f"❌ Capture error for {self.name}: {str(e)}")
                time.sleep(0.1)
    
    def get_frame(self, timeout=1.0):
        """
        Get next frame from queue
        :param timeout: Wait timeout in seconds
        :return: Frame or None
        """
        try:
            return self.frame_queue.get(timeout=timeout)
        except queue.Empty:
            return None
    
    def get_latest_frame(self):
        """Get the most recent frame"""
        return self.latest_frame
    
    def preprocess_frame(self, frame, grayscale=False, denoise=False):
        """
        Preprocess frame for AI model input
        :param frame: Input frame
        :param grayscale: Convert to grayscale
        :param denoise: Apply denoising
        :return: Preprocessed frame
        """
        if frame is None:
            return None
        
        processed = frame.copy()
        
        # Resize for consistent processing
        if processed.shape[1] != self.resize_width or processed.shape[0] != self.resize_height:
            processed = cv2.resize(processed, (self.resize_width, self.resize_height))
        
        # Convert to grayscale if requested
        if grayscale:
            processed = cv2.cvtColor(processed, cv2.COLOR_BGR2GRAY)
        
        # Apply denoising
        if denoise:
            processed = cv2.fastNlMeansDenoisingColored(processed, None, 10, 10, 7, 21)
        
        return processed
    
    def capture_snapshot(self, filename=None):
        """
        Capture and save current frame as snapshot
        :param filename: Output filename (auto-generated if None)
        :return: Filename or None
        """
        frame = self.get_latest_frame()
        if frame is None:
            return None
        
        if filename is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"snapshot_{self.name}_{timestamp}.jpg"
        
        try:
            cv2.imwrite(filename, frame)
            print(f"📸 Snapshot saved: {filename}")
            return filename
        except Exception as e:
            print(f"❌ Failed to save snapshot: {str(e)}")
            return None
    
    def get_frame_as_base64(self, frame=None):
        """
        Convert frame to base64 for web transmission
        :param frame: Frame to convert (uses latest if None)
        :return: Base64 encoded string
        """
        if frame is None:
            frame = self.get_latest_frame()
        
        if frame is None:
            return None
        
        try:
            _, buffer = cv2.imencode('.jpg', frame)
            jpg_as_text = base64.b64encode(buffer).decode('utf-8')
            return f"data:image/jpeg;base64,{jpg_as_text}"
        except Exception as e:
            print(f"❌ Base64 encoding failed: {str(e)}")
            return None
    
    def start_recording(self, filename=None, codec='mp4v'):
        """
        Start recording video
        :param filename: Output filename
        :param codec: Video codec
        :return: Success status
        """
        if self.recording:
            print("⚠️ Already recording")
            return False
        
        frame = self.get_latest_frame()
        if frame is None:
            print("❌ No frame available to start recording")
            return False
        
        if filename is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"recording_{self.name}_{timestamp}.mp4"
        
        try:
            fourcc = cv2.VideoWriter_fourcc(*codec)
            height, width = frame.shape[:2]
            
            self.video_writer = cv2.VideoWriter(
                filename, fourcc, self.fps, (width, height)
            )
            
            self.recording = True
            print(f"🔴 Recording started: {filename}")
            return True
            
        except Exception as e:
            print(f"❌ Failed to start recording: {str(e)}")
            return False
    
    def stop_recording(self):
        """Stop video recording"""
        if not self.recording:
            return None
        
        self.recording = False
        if self.video_writer:
            self.video_writer.release()
            self.video_writer = None
        
        print("⏺️ Recording stopped")
        return True
    
    def draw_detections(self, frame, detections, show_count=True):
        """
        Draw bounding boxes and labels on frame
        :param frame: Input frame
        :param detections: List of detection dicts with bbox and label
        :param show_count: Show person count
        :return: Annotated frame
        """
        annotated = frame.copy()
        
        for detection in detections:
            bbox = detection.get('bbox', [])
            label = detection.get('label', 'Person')
            confidence = detection.get('confidence', 0)
            
            if len(bbox) == 4:
                x1, y1, x2, y2 = map(int, bbox)
                
                # Draw bounding box
                color = (0, 255, 0)  # Green
                cv2.rectangle(annotated, (x1, y1), (x2, y2), color, 2)
                
                # Draw label
                label_text = f"{label} {confidence:.2f}"
                cv2.putText(annotated, label_text, (x1, y1 - 10),
                           cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
        
        # Draw person count
        if show_count:
            count_text = f"People: {len(detections)}"
            cv2.putText(annotated, count_text, (10, 30),
                       cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
        
        return annotated
    
    def add_timestamp(self, frame):
        """Add timestamp overlay to frame"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        cv2.putText(frame, timestamp, (10, frame.shape[0] - 10),
                   cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
        return frame
    
    def add_camera_label(self, frame):
        """Add camera name overlay"""
        cv2.putText(frame, self.name, (10, 30),
                   cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
        return frame
    
    def get_stats(self):
        """Get processor statistics"""
        return {
            'name': self.name,
            'source': self.source,
            'is_running': self.is_running,
            'fps': self.fps,
            'frames_processed': self.frame_count,
            'queue_size': self.frame_queue.qsize(),
            'recording': self.recording,
            'connected': self.cap is not None and self.cap.isOpened()
        }


class MultiCameraProcessor:
    """
    Manages multiple camera streams simultaneously
    """
    
    def __init__(self):
        self.cameras = {}
        self.is_running = False
        
    def add_camera(self, camera_id, source, name=None):
        """
        Add camera to processor
        :param camera_id: Unique camera identifier
        :param source: Video source
        :param name: Camera name
        """
        if name is None:
            name = f"Camera-{camera_id}"
        
        processor = VideoProcessor(source, name)
        self.cameras[camera_id] = processor
        print(f"➕ Added {name} (ID: {camera_id})")
        return processor
    
    def remove_camera(self, camera_id):
        """Remove camera from processor"""
        if camera_id in self.cameras:
            self.cameras[camera_id].stop_capture()
            self.cameras[camera_id].disconnect()
            del self.cameras[camera_id]
            print(f"➖ Removed camera {camera_id}")
    
    def start_all(self):
        """Start all cameras"""
        success_count = 0
        for camera_id, processor in self.cameras.items():
            if processor.start_capture():
                success_count += 1
        
        self.is_running = True
        print(f"▶️ Started {success_count}/{len(self.cameras)} cameras")
        return success_count
    
    def stop_all(self):
        """Stop all cameras"""
        for processor in self.cameras.values():
            processor.stop_capture()
            processor.disconnect()
        
        self.is_running = False
        print("⏹️ All cameras stopped")
    
    def get_camera(self, camera_id):
        """Get specific camera processor"""
        return self.cameras.get(camera_id)
    
    def get_all_frames(self):
        """Get latest frame from all cameras"""
        frames = {}
        for camera_id, processor in self.cameras.items():
            frame = processor.get_latest_frame()
            if frame is not None:
                frames[camera_id] = frame
        return frames
    
    def get_all_stats(self):
        """Get statistics from all cameras"""
        return {
            camera_id: processor.get_stats()
            for camera_id, processor in self.cameras.items()
        }
    
    def create_grid_view(self, max_cols=2):
        """
        Create grid view of all camera feeds
        :param max_cols: Maximum columns in grid
        :return: Combined grid frame
        """
        frames = self.get_all_frames()
        if not frames:
            return None
        
        # Get frame dimensions
        sample_frame = next(iter(frames.values()))
        height, width = sample_frame.shape[:2]
        
        # Calculate grid dimensions
        num_cameras = len(frames)
        cols = min(num_cameras, max_cols)
        rows = (num_cameras + cols - 1) // cols
        
        # Create blank grid
        grid_height = height * rows
        grid_width = width * cols
        grid = np.zeros((grid_height, grid_width, 3), dtype=np.uint8)
        
        # Place frames in grid
        for idx, (camera_id, frame) in enumerate(frames.items()):
            row = idx // cols
            col = idx % cols
            
            y_start = row * height
            y_end = y_start + height
            x_start = col * width
            x_end = x_start + width
            
            # Add camera label
            processor = self.cameras[camera_id]
            frame_with_label = processor.add_camera_label(frame.copy())
            
            grid[y_start:y_end, x_start:x_end] = frame_with_label
        
        return grid


# Example usage and testing
if __name__ == "__main__":
    print("🎥 Video Processor - Test Mode\n")
    print("=" * 60)
    
    # Test 1: Single camera
    print("\n📹 Test 1: Single Camera Processing")
    processor = VideoProcessor(source=0, name="Test-Camera")
    
    if processor.connect():
        processor.start_capture()
        
        print("Processing 10 frames...")
        for i in range(10):
            frame = processor.get_frame(timeout=2.0)
            if frame is not None:
                print(f"  Frame {i+1}: {frame.shape}")
                
                # Add overlays
                frame = processor.add_timestamp(frame)
                frame = processor.add_camera_label(frame)
                
                # Show frame (optional)
                # cv2.imshow('Test', frame)
                # cv2.waitKey(1)
        
        # Test snapshot
        print("\n📸 Testing snapshot capture...")
        snapshot_file = processor.capture_snapshot()
        
        # Test recording
        print("\n🔴 Testing video recording...")
        processor.start_recording()
        time.sleep(3)  # Record for 3 seconds
        processor.stop_recording()
        
        # Get stats
        print("\n📊 Processor Statistics:")
        stats = processor.get_stats()
        for key, value in stats.items():
            print(f"  {key}: {value}")
        
        processor.stop_capture()
        processor.disconnect()
    
    # Test 2: Multi-camera (requires multiple cameras)
    print("\n\n📹 Test 2: Multi-Camera Processing")
    multi = MultiCameraProcessor()
    
    # Add cameras (adjust sources as needed)
    multi.add_camera('cam1', 0, 'Webcam')
    # multi.add_camera('cam2', 'rtsp://camera2/stream', 'IP-Camera-1')
    
    multi.start_all()
    time.sleep(2)
    
    print("\n📊 All Camera Statistics:")
    all_stats = multi.get_all_stats()
    for cam_id, stats in all_stats.items():
        print(f"\n{cam_id}:")
        for key, value in stats.items():
            print(f"  {key}: {value}")
    
    # Create grid view
    print("\n🎬 Creating grid view...")
    grid = multi.create_grid_view(max_cols=2)
    if grid is not None:
        print(f"Grid created: {grid.shape}")
        # cv2.imshow('Multi-Camera Grid', grid)
        # cv2.waitKey(3000)
    
    multi.stop_all()
    
    print("\n" + "=" * 60)
    print("✅ Video processing test complete!")
    print("\nNote: Uncomment cv2.imshow() lines to see visual output")