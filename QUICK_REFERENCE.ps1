#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Quick reference for SentiAI deployment and common commands
.DESCRIPTION
    Handy commands for managing SentiAI services
#>

# ==========================================
# 🚀 QUICK START - Copy & Paste These
# ==========================================

Write-Host "
╔════════════════════════════════════════════════════════════════╗
║           SentiAI - Quick Reference Commands                   ║
╚════════════════════════════════════════════════════════════════╝
" -ForegroundColor Cyan

Write-Host "`n📍 DEPLOYMENT LINKS (After running docker compose up)" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Host "Frontend Dashboard:    http://localhost" -ForegroundColor Green
Write-Host "Backend API:           http://localhost/api" -ForegroundColor Green
Write-Host "Health Check:          http://localhost:5000/health" -ForegroundColor Green
Write-Host "WebSocket:             ws://localhost/ws" -ForegroundColor Green

Write-Host "`n🎯 DEPLOYMENT COMMANDS" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

$commands = @(
    @{cmd = ".\deploy.ps1 build"; desc = "Build Docker images" },
    @{cmd = ".\deploy.ps1 start"; desc = "Start services (detached)" },
    @{cmd = ".\deploy.ps1 stop"; desc = "Stop services" },
    @{cmd = ".\deploy.ps1 restart"; desc = "Restart services" },
    @{cmd = ".\deploy.ps1 logs"; desc = "View live logs (Ctrl+C to exit)" },
    @{cmd = ".\deploy.ps1 status"; desc = "Check service status" }
)

$commands | ForEach-Object {
    Write-Host "$($_.cmd)" -ForegroundColor Cyan
    Write-Host "  └─ $($_.desc)" -ForegroundColor Gray
}

Write-Host "`n🐳 MANUAL DOCKER COMPOSE COMMANDS" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

$dockerCmds = @(
    @{cmd = "docker compose up --build -d"; desc = "Build and start all services" },
    @{cmd = "docker compose ps"; desc = "List all services and status" },
    @{cmd = "docker compose logs -f"; desc = "View all logs (follow mode)" },
    @{cmd = "docker compose logs -f backend"; desc = "View backend logs only" },
    @{cmd = "docker compose logs -f frontend"; desc = "View frontend logs only" },
    @{cmd = "docker compose down"; desc = "Stop and remove all services" },
    @{cmd = "docker compose down -v"; desc = "Stop and remove (including volumes)" }
)

$dockerCmds | ForEach-Object {
    Write-Host "$($_.cmd)" -ForegroundColor Cyan
    Write-Host "  └─ $($_.desc)" -ForegroundColor Gray
}

Write-Host "`n🧪 TESTING COMMANDS" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

Write-Host "# Check backend health" -ForegroundColor Gray
Write-Host "Invoke-WebRequest -UseBasicParsing http://localhost:5000/health" -ForegroundColor Cyan

Write-Host "`n# Get alerts" -ForegroundColor Gray
Write-Host "Invoke-WebRequest -UseBasicParsing http://localhost:5000/api/alerts" -ForegroundColor Cyan

Write-Host "`n# Open frontend in browser" -ForegroundColor Gray
Write-Host "Start-Process 'http://localhost'" -ForegroundColor Cyan

Write-Host "`n🔧 TROUBLESHOOTING COMMANDS" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

Write-Host "# Check if ports are in use" -ForegroundColor Gray
Write-Host "netstat -ano | findstr :80" -ForegroundColor Cyan
Write-Host "netstat -ano | findstr :5000" -ForegroundColor Cyan

Write-Host "`n# Kill process using a port (replace PID)" -ForegroundColor Gray
Write-Host "taskkill /PID <pid> /F" -ForegroundColor Cyan

Write-Host "`n# Clean up Docker (remove unused images/containers)" -ForegroundColor Gray
Write-Host "docker system prune -a" -ForegroundColor Cyan

Write-Host "`n# Rebuild without cache" -ForegroundColor Gray
Write-Host "docker compose build --no-cache" -ForegroundColor Cyan

Write-Host "`n# Check Docker disk usage" -ForegroundColor Gray
Write-Host "docker system df" -ForegroundColor Cyan

Write-Host "`n# View resource usage (running containers)" -ForegroundColor Gray
Write-Host "docker stats" -ForegroundColor Cyan

Write-Host "`n📁 PROJECT STRUCTURE" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Host @"
SentiAI/
├── docker-compose.yml          # Service orchestration
├── deploy.ps1                  # Deployment script
├── README.md                   # Project documentation
├── DEPLOYMENT.md               # Detailed deployment guide
├── DEPLOYMENT_LINKS.md         # Access links & quick ref
├── .env.example                # Environment template
├── .gitignore                  # Git ignore rules
│
├── sentriai/
│   ├── backend/
│   │   ├── Dockerfile          # Python + Flask + Gunicorn
│   │   ├── app.py              # Flask app entry
│   │   ├── wsgi.py             # WSGI entry
│   │   ├── requirements.txt    # Python dependencies
│   │   └── models/             # ML models
│   │
│   └── frontend/
│       ├── Dockerfile          # Node + Nginx
│       ├── nginx.conf          # Nginx config
│       ├── package.json        # Node dependencies
│       └── src/                # React source
"@ -ForegroundColor Gray

Write-Host "`n📞 DOCUMENTATION FILES" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Host "README.md              → Project overview & features" -ForegroundColor Gray
Write-Host "DEPLOYMENT.md          → Detailed deployment guide (250+ lines)" -ForegroundColor Gray
Write-Host "DEPLOYMENT_LINKS.md    → Quick access links & commands" -ForegroundColor Gray
Write-Host ".env.example           → Environment variables template" -ForegroundColor Gray
Write-Host "deploy.ps1             → Automated deployment script" -ForegroundColor Gray

Write-Host "`n⚡ NEXT STEPS" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Host "1. Configure environment: copy .env.example .env" -ForegroundColor Cyan
Write-Host "2. Build images: .\deploy.ps1 build" -ForegroundColor Cyan
Write-Host "3. Start services: .\deploy.ps1 start" -ForegroundColor Cyan
Write-Host "4. Check status: .\deploy.ps1 status" -ForegroundColor Cyan
Write-Host "5. Open browser: http://localhost" -ForegroundColor Cyan

Write-Host "`n✅ DEPLOYMENT COMPLETE!`n" -ForegroundColor Green
