# SentiAI - Crowd Safety Monitoring System

A real-time crowd detection and safety monitoring platform using AI/ML for event venues, stadiums, and public spaces.

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Git
- Windows/Mac/Linux

### Deploy in 3 Steps

```powershell
# 1. Clone and navigate
git clone https://github.com/HACKWAVE2025/B15.git
cd B15

# 2. Setup environment
copy .env.example .env
# Edit .env with your secrets if needed

# 3. Deploy using the script
.\deploy.ps1 build
.\deploy.ps1 start
```

**Service URLs:**
- 🌐 **Frontend**: http://localhost
- 🔌 **Backend API**: http://localhost/api
- 💚 **Health Check**: http://localhost:5000/health

### Alternative: Manual Docker Compose

```powershell
cd C:\Users\manas\OneDrive\Desktop\SentiAI
docker compose up --build -d
docker compose ps
docker compose logs -f
```

## 📋 Features

✅ **Real-time Crowd Detection**
- OpenCV-based person detection using HOG descriptor
- Live video feed analysis (2.8-3.0 FPS per stream)
- Crowd density calculation and alerts

✅ **Dashboard & Monitoring**
- React SPA with Vite bundler
- Live event map with crowd hotspots
- Real-time alerts and incident tracking
- Response team status management

✅ **Backend API**
- Flask web framework with CORS support
- RESTful endpoints for video analysis
- Alert management system
- WebSocket support for real-time updates

✅ **Production Ready**
- Docker containerization
- Nginx reverse proxy with API routing
- Environment-based configuration
- Health checks and monitoring

## 📁 Project Structure

```
.
├── docker-compose.yml           # Orchestrate backend & frontend
├── deploy.ps1                   # PowerShell deployment script
├── .env.example                 # Environment variables template
├── DEPLOYMENT.md                # Comprehensive deployment guide
├── README.md                    # This file
│
├── sentriai/
│   ├── backend/
│   │   ├── Dockerfile          # Python 3.11 + Flask + Gunicorn
│   │   ├── app.py              # Flask application entry point
│   │   ├── wsgi.py             # WSGI entry for Gunicorn
│   │   ├── requirements.txt     # Python dependencies
│   │   ├── models/
│   │   │   ├── crowd_detection.py    # HOG-based detection
│   │   │   ├── anomaly_detection.py
│   │   │   └── risk_scoring.py
│   │   ├── routes/
│   │   │   ├── alerts.py       # Alert management endpoints
│   │   │   └── analytics.py    # Analytics endpoints
│   │   ├── utils/
│   │   │   ├── firebase_helper.py
│   │   │   └── video_processing.py
│   │   ├── config/
│   │   │   └── config.py       # Configuration management
│   │   └── output/             # Detection results storage
│   │
│   └── frontend/
│       ├── Dockerfile          # Node build + Nginx serve
│       ├── nginx.conf          # Reverse proxy configuration
│       ├── package.json        # Node dependencies
│       ├── vite.config.js      # Vite build configuration
│       ├── tailwind.config.js  # Tailwind CSS config
│       ├── public/             # Static assets
│       └── src/
│           ├── app.jsx         # React main component
│           ├── main.jsx        # Entry point
│           ├── index.css       # Global styles
│           ├── pages/          # Page components
│           ├── components/     # Reusable components
│           ├── services/       # API & WebSocket services
│           ├── context/        # React context (auth)
│           └── utils/          # Helper utilities
```

## 🔌 API Endpoints

### Health & Status
- `GET /health` - Backend health check
- `GET /api/alerts` - Fetch recent alerts
- `GET /api/analyze-video` - Analyze video frame (POST)

### Example API Call
```powershell
# Check backend health
Invoke-WebRequest -UseBasicParsing http://localhost:5000/health | Select-Object -ExpandProperty Content

# Expected response:
# {"status": "healthy", "timestamp": "2026-01-02T..."}
```

## 🐳 Docker Services

### Backend Service
- **Image**: Python 3.11 slim with opencv-python-headless
- **Port**: 5000 (internal)
- **Runtime**: Gunicorn WSGI server with 2 workers
- **Health Check**: HTTP GET /health every 30s

### Frontend Service
- **Image**: Nginx Alpine serving React SPA
- **Port**: 80 (HTTP), 443 (HTTPS-ready)
- **Reverse Proxy**: Routes /api/* to backend
- **WebSocket**: Full duplex support for real-time updates

## ⚙️ Configuration

### Environment Variables (`.env`)
```bash
FLASK_ENV=production
PORT=5000
# Add your Firebase credentials, DB URIs, etc.
```

### Production Checklist
- [ ] Set strong `SECRET_KEY` in `.env`
- [ ] Configure HTTPS with SSL certificates
- [ ] Set database connection strings (MongoDB, Firebase)
- [ ] Configure logging and monitoring
- [ ] Set up backups for output volumes
- [ ] Review security group rules (firewall)

## 📊 Monitoring & Logs

```powershell
# View all logs
docker compose logs -f

# View specific service
docker compose logs -f backend
docker compose logs -f frontend

# Check service status
docker compose ps

# Monitor resource usage
docker stats

# Check health endpoint
curl http://localhost:5000/health
```

## 🚢 Deployment Options

### Local Development
```powershell
.\deploy.ps1 start
```

### Production on AWS EC2
1. Launch Ubuntu 22.04 LTS instance
2. Install Docker: `sudo apt-get install docker.io docker-compose`
3. Clone repo and `.env` with secrets
4. Run: `sudo docker compose up -d`
5. Configure security group (allow 80, 443)
6. Set up HTTPS with Let's Encrypt

### Kubernetes
```powershell
kompose convert -f docker-compose.yml -o k8s/
kubectl apply -f k8s/
```

### Docker Swarm
```powershell
docker swarm init
docker stack deploy -c docker-compose.yml sentriai
```

## 🔐 Security

- **Environment Secrets**: Use `.env` (excluded from git)
- **API Authentication**: Ready to integrate JWT/Firebase Auth
- **HTTPS**: Configure with reverse proxy (Traefik, nginx)
- **Containers**: Run as non-root, read-only filesystems where possible

## 📈 Scaling

### Horizontal Scaling
- Add multiple backend workers: update `--workers` in Dockerfile
- Use load balancer (AWS ALB, Nginx) to distribute traffic
- Run multiple replicas: `docker compose up -d --scale backend=3`

### Vertical Scaling
- Increase Docker memory/CPU limits
- Upgrade host machine resources

## 🐛 Troubleshooting

### Build Fails
```powershell
# Clean and rebuild
docker system prune -a
docker compose build --no-cache
```

### Port Already in Use
```powershell
# Find process using port 80, 443, or 5000
netstat -ano | findstr :80
# Kill process: taskkill /PID <pid> /F
```

### Frontend Can't Reach Backend
- Ensure docker network is created: `docker network ls`
- Check nginx proxy: `docker compose exec frontend cat /etc/nginx/conf.d/default.conf`
- Verify backend is running: `docker compose logs backend`

### Database Connection Issues
- Update `MONGO_URI` or `FIREBASE_CREDENTIALS` in `.env`
- Ensure credentials file is mounted correctly
- Check backend logs for connection errors

## 📝 API Documentation

Complete API docs available at `/api` route (add Swagger/OpenAPI as needed).

### POST /api/analyze-video
Analyze video frame for crowd detection

**Request:**
```json
{
  "frame": "<base64-encoded-image>"
}
```

**Response:**
```json
{
  "count": 12,
  "density": 45.2,
  "detections": [
    {
      "bbox": [x1, y1, x2, y2],
      "confidence": 0.92
    }
  ]
}
```

## 🤝 Contributing

1. Fork the repo
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

Licensed under the MIT License - see LICENSE file for details.

## 🆘 Support

- 📖 See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment guide
- 💬 Create an issue on GitHub for bug reports
- 📧 Contact: support@sentriai.com (or your contact)

## 🎯 Roadmap

- [ ] Real-time 3D visualization
- [ ] Multi-camera tracking
- [ ] Anomaly detection (fall detection, fights)
- [ ] Mobile app (React Native)
- [ ] Advanced ML models (YOLOv10, etc.)
- [ ] Integration with emergency services
- [ ] Sentiment analysis from audio

---

**Built with ❤️ for safer, smarter events**
