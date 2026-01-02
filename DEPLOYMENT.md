# SentiAI Deployment Guide

This guide covers deploying the SentiAI crowd safety monitoring system using Docker Compose. The deployment includes:
- **Backend**: Flask app running on port 5000 via Gunicorn
- **Frontend**: React/Vite app served by Nginx on port 80/443
- **Networking**: Nginx reverse proxy routes `/api` calls to the Flask backend

## Prerequisites

- Docker and Docker Compose installed
- Git for version control
- (Optional) A domain name for HTTPS setup

## Quick Start

### 1. Setup Environment Variables

Copy the example environment file and customize:
```powershell
cd C:\Users\manas\OneDrive\Desktop\SentiAI
copy .env.example .env
notepad .env  # Edit to add secrets if needed
```

The `.env` file includes Flask settings, database URIs, and secret keys. **Never commit `.env` to git** — it's excluded in `.gitignore`.

### 2. Deploy Using the Deploy Script

The easiest way is to use the provided PowerShell deploy script:

```powershell
cd C:\Users\manas\OneDrive\Desktop\SentiAI

# Build images (first time only, or after code changes)
.\deploy.ps1 build

# Start services
.\deploy.ps1 start

# Check status
.\deploy.ps1 status

# View logs
.\deploy.ps1 logs

# Stop services
.\deploy.ps1 stop

# Restart services
.\deploy.ps1 restart
```

### 3. Manual Docker Compose Commands

If you prefer direct Docker Compose commands:

```powershell
cd C:\Users\manas\OneDrive\Desktop\SentiAI

# Build and start in one command
docker compose up --build -d

# View status
docker compose ps

# View logs
docker compose logs -f
docker compose logs -f backend
docker compose logs -f frontend

# Stop and remove containers
docker compose down
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Docker Compose                       │
├──────────────────────────┬──────────────────────────────────┤
│  Frontend (Nginx)        │  Backend (Gunicorn + Flask)      │
├──────────────────────────┼──────────────────────────────────┤
│ • React SPA (Vite)       │ • Flask web framework            │
│ • Reverse proxy for API  │ • Crowd detection models         │
│ • WebSocket support      │ • Redis/MongoDB ready (optional) │
│ • Port 80, 443 (HTTPS)   │ • Port 5000 (internal)           │
└──────────────────────────┴──────────────────────────────────┘
```

## Health Checks

The backend includes a health check endpoint for monitoring:

```powershell
# From host machine
Invoke-WebRequest -UseBasicParsing http://localhost:5000/health

# Expected response:
# {"status": "healthy", "timestamp": "..."}
```

Nginx also forwards health checks to the backend via `/health`.

## Production Considerations

### 1. Environment Variables & Secrets
- Use `.env` for configuration (loaded by docker-compose)
- For sensitive data (API keys, DB passwords), use Docker secrets or a secrets manager
- Example: Firebase credentials can be mounted as volumes

### 2. Volumes & Persistence
- Backend volumes: `./sentriai/backend/output` (detection results), `./sentriai/backend/temp` (temp files)
- Frontend nginx config is read-only: `./sentriai/frontend/nginx.conf`
- Add database volumes if using MongoDB/Redis

### 3. HTTPS/TLS
Currently, the deployment uses HTTP on port 80. For HTTPS:
- **Option A (Easy)**: Use a reverse proxy (Traefik, Caddy) in front of Docker Compose with Let's Encrypt
- **Option B**: Bind Nginx to port 443 and mount SSL certificates:
  ```yaml
  # In docker-compose.yml
  ports:
    - "443:443"
  volumes:
    - ./certs/fullchain.pem:/etc/nginx/certs/fullchain.pem:ro
    - ./certs/privkey.pem:/etc/nginx/certs/privkey.pem:ro
  ```

### 4. Scaling & Load Balancing
- Modify backend `--workers` in `sentriai/backend/Dockerfile` for concurrency
- Use Docker's swarm or Kubernetes for multi-node deployments
- Add a load balancer (AWS ALB, Nginx, HAProxy) for traffic distribution

### 5. Monitoring & Logging
- View logs: `docker compose logs -f`
- Integrate with monitoring tools (Prometheus, Grafana, DataDog)
- Set up log aggregation (ELK stack, Loki)

### 6. Database Integration
The app is ready for external databases:
- **MongoDB**: Set `MONGO_URI` in `.env`, update Flask to use motor (async driver)
- **Firebase**: Mount service account key and set `FIREBASE_CREDENTIALS` path
- **Redis**: Add a Redis service in `docker-compose.yml`

Example adding Redis:
```yaml
redis:
  image: redis:7-alpine
  ports:
    - "6379:6379"
  restart: unless-stopped
  networks:
    - sentriai-net
```

## Troubleshooting

### Build Fails with Package Errors
- Ensure Docker has enough disk space and RAM
- Try: `docker system prune` to clean up old images/containers
- Check `docker compose build --no-cache` for a fresh build

### Services Don't Start
- Check logs: `docker compose logs`
- Verify ports 80, 443, 5000 are not in use: `netstat -ano | findstr :5000`
- Ensure `.env` file exists and is properly formatted

### API Calls Fail from Frontend
- Nginx reverse proxy requires backend service name to be resolvable
- Check `docker compose ps` to ensure both services are running
- Review `sentriai/frontend/nginx.conf` for proxy configuration

### WebSocket Connection Issues
- Ensure Nginx `/ws` route is configured (already in `nginx.conf`)
- Check browser console for connection errors
- Verify backend listens on correct port/hostname

## Deployment to Production Servers

### AWS EC2 / Azure VM
1. Install Docker and Docker Compose on the VM
2. Clone the repo: `git clone <repo-url>`
3. Set up `.env` with production secrets
4. Run: `docker compose up -d`
5. Use a reverse proxy (Nginx, Traefik) + Let's Encrypt for HTTPS
6. Configure security groups / firewall rules to allow ports 80, 443

### Docker Swarm
```powershell
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml sentriai
```

### Kubernetes
Use `docker-compose.yml` to generate Kubernetes manifests:
```powershell
kompose convert -f docker-compose.yml -o k8s/
```

Then deploy:
```powershell
kubectl apply -f k8s/
```

## Files

- **`docker-compose.yml`**: Orchestration config for backend and frontend
- **`sentriai/backend/Dockerfile`**: Backend image (Python, Flask, Gunicorn)
- **`sentriai/frontend/Dockerfile`**: Frontend image (Node build, Nginx serve)
- **`sentriai/frontend/nginx.conf`**: Nginx reverse proxy & API routing config
- **`.env.example`**: Template for environment variables
- **`.gitignore`**: Prevents committing secrets and build artifacts
- **`deploy.ps1`**: PowerShell script for easy deployment management

## Useful Commands

```powershell
# View all running containers
docker compose ps

# Execute a command in a running container
docker compose exec backend python -c "import cv2; print(cv2.__version__)"

# Rebuild only the backend image
docker compose build backend

# Remove all containers and volumes
docker compose down -v

# View resource usage
docker stats

# Pull latest images before deploying
docker compose pull
```

## Support & Next Steps

- Review logs for errors: `docker compose logs -f`
- Check health endpoint: `curl http://localhost:5000/health`
- Monitor resource usage: `docker stats`
- For advanced setups, integrate with CI/CD (GitHub Actions, GitLab CI)
