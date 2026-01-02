#!/usr/bin/env pwsh
# Deploy script for SentiAI
# Usage: .\deploy.ps1 [build|start|stop|restart|logs]

param(
    [ValidateSet("build", "start", "stop", "restart", "logs", "status")]
    [string]$Action = "start"
)

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommandPath

function Build-Images {
    Write-Host "🔨 Building Docker images..." -ForegroundColor Cyan
    Set-Location $ProjectRoot
    docker compose build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Build failed!" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Build complete!" -ForegroundColor Green
}

function Start-Services {
    Write-Host "🚀 Starting services..." -ForegroundColor Cyan
    Set-Location $ProjectRoot
    docker compose up -d
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to start services!" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Services started!" -ForegroundColor Green
    Write-Host "Frontend: http://localhost" -ForegroundColor Yellow
    Write-Host "Backend API: http://localhost/api" -ForegroundColor Yellow
}

function Stop-Services {
    Write-Host "⛔ Stopping services..." -ForegroundColor Cyan
    Set-Location $ProjectRoot
    docker compose down
    Write-Host "✅ Services stopped!" -ForegroundColor Green
}

function Restart-Services {
    Write-Host "🔄 Restarting services..." -ForegroundColor Cyan
    Stop-Services
    Start-Services
}

function Show-Logs {
    Write-Host "📋 Showing logs (Ctrl+C to exit)..." -ForegroundColor Cyan
    Set-Location $ProjectRoot
    docker compose logs -f
}

function Show-Status {
    Write-Host "📊 Service status:" -ForegroundColor Cyan
    Set-Location $ProjectRoot
    docker compose ps
    Write-Host ""
    Write-Host "Testing backend health..." -ForegroundColor Cyan
    try {
        $response = Invoke-WebRequest -UseBasicParsing -Uri http://localhost:5000/health -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ Backend is healthy" -ForegroundColor Green
        }
    } catch {
        Write-Host "⚠️  Backend health check failed" -ForegroundColor Yellow
    }
}

# Execute action
switch ($Action) {
    "build" { Build-Images }
    "start" { Start-Services }
    "stop" { Stop-Services }
    "restart" { Restart-Services }
    "logs" { Show-Logs }
    "status" { Show-Status }
    default { Show-Status }
}
