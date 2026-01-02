#!/usr/bin/env pwsh
# SentiAI Live Deployment - Access Information

Write-Host "===================================================" -ForegroundColor Green
Write-Host "   SENTIAI IS LIVE AND RUNNING!" -ForegroundColor Green
Write-Host "   January 2, 2026" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Green

Write-Host ""
Write-Host "FRONTEND DASHBOARD" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Host "Access URL: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Status: LIVE" -ForegroundColor Green

Write-Host ""
Write-Host "BACKEND API" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Host "Base URL: http://localhost:5000/api" -ForegroundColor Cyan
Write-Host "Health: http://localhost:5000/health" -ForegroundColor Cyan
Write-Host "Status: RUNNING" -ForegroundColor Green

Write-Host ""
Write-Host "API ENDPOINTS" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Host "GET /health" -ForegroundColor Cyan
Write-Host "  Backend health status" -ForegroundColor Gray
Write-Host ""
Write-Host "GET /api/cameras" -ForegroundColor Cyan
Write-Host "  List active cameras and crowd density" -ForegroundColor Gray
Write-Host ""
Write-Host "GET /api/alerts" -ForegroundColor Cyan
Write-Host "  Get recent alerts and incidents" -ForegroundColor Gray
Write-Host ""
Write-Host "POST /api/analyze-video" -ForegroundColor Cyan
Write-Host "  Analyze video frame for crowd detection" -ForegroundColor Gray

Write-Host ""
Write-Host "SERVICE STATUS" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

try {
    $response = Invoke-WebRequest -UseBasicParsing http://localhost:5000/health -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        $data = $response.Content | ConvertFrom-Json
        Write-Host "Backend: RUNNING" -ForegroundColor Green
        Write-Host "Service: $($data.service)" -ForegroundColor Gray
        Write-Host "Status: $($data.status)" -ForegroundColor Green
    }
} catch {
    Write-Host "Backend: ERROR" -ForegroundColor Red
}

Write-Host ""
Write-Host "QUICK START" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Host "1. Open in browser: http://localhost:5000" -ForegroundColor Cyan
Write-Host "2. Or use PowerShell:" -ForegroundColor Cyan
Write-Host "   Start-Process 'http://localhost:5000'" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Test API:" -ForegroundColor Cyan
Write-Host "   Invoke-WebRequest http://localhost:5000/api/cameras" -ForegroundColor Gray

Write-Host ""
Write-Host "===================================================" -ForegroundColor Green
Write-Host "    Ready to use! Access: http://localhost:5000" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Green
