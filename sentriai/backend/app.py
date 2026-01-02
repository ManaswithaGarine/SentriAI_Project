from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from datetime import datetime

app = Flask(__name__, static_folder='../frontend/dist', static_url_path='')
CORS(app)

# Mock data for demo
MOCK_ALERTS = [
    {"id": 1, "type": "crowd_density", "severity": "high", "location": "Main Entrance", "timestamp": datetime.now().isoformat()},
    {"id": 2, "type": "unusual_activity", "severity": "medium", "location": "Section A", "timestamp": datetime.now().isoformat()}
]

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "SentiAI Backend",
        "timestamp": datetime.now().isoformat()
    }), 200

@app.route('/api/alerts', methods=['GET'])
def get_alerts():
    """Fetch recent alerts"""
    try:
        return jsonify({"alerts": MOCK_ALERTS}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/analyze-video', methods=['POST'])
def analyze_video():
    """Analyze video feed for crowd density"""
    try:
        if 'video' not in request.files:
            return jsonify({"error": "No video file provided"}), 400
        
        # Mock analysis result
        result = {
            'count': 42,
            'density': 65.5,
            'detections': [
                {'bbox': [10, 20, 100, 150], 'confidence': 0.95},
                {'bbox': [150, 50, 250, 180], 'confidence': 0.88},
            ],
            'frame_shape': [480, 640, 3]
        }
        
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/cameras', methods=['GET'])
def get_cameras():
    """Get active cameras"""
    cameras = [
        {"id": 1, "name": "Main Entrance", "status": "online", "crowd_density": 65},
        {"id": 2, "name": "Section A", "status": "online", "crowd_density": 42},
        {"id": 3, "name": "Exit Gate", "status": "online", "crowd_density": 28}
    ]
    return jsonify({"cameras": cameras}), 200

# Serve React SPA
@app.route('/')
def serve_index():
    """Serve the frontend index.html"""
    if os.path.exists(os.path.join(app.static_folder, 'index.html')):
        return send_from_directory(app.static_folder, 'index.html')
    return jsonify({"message": "SentiAI Backend Running", "frontend_status": "not_built"}), 200

@app.route('/<path:path>')
def serve_static(path):
    """Serve static files (CSS, JS, assets)"""
    if os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    # For React Router, redirect to index.html
    if os.path.exists(os.path.join(app.static_folder, 'index.html')):
        return send_from_directory(app.static_folder, 'index.html')
    return jsonify({"error": f"File {path} not found"}), 404

if __name__ == '__main__':
    print("🚀 SentiAI Backend Starting...")
    print("📍 Server: http://0.0.0.0:5000")
    print("🌐 Frontend: http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=False)
