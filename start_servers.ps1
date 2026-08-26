# PowerShell Launcher for ControlPlane Checker
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "  Starting ControlPlane Checker (Accenture Innovation Challenge)" -ForegroundColor Yellow
Write-Host "====================================================================" -ForegroundColor Cyan

# Start Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; py -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

Start-Sleep -Seconds 2

# Start Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm.cmd run dev"

Write-Host "`nBackend API:  http://localhost:8000" -ForegroundColor Green
Write-Host "Frontend App: http://localhost:5173" -ForegroundColor Green
