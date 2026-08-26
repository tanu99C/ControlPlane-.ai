@echo off
echo ====================================================================
echo   Starting ControlPlane Checker Platform (Accenture Innovation Challenge)
echo ====================================================================
echo.

start "ControlPlane Backend (FastAPI)" cmd /k "cd backend && py -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"
timeout /t 2 /nobreak >nul

start "ControlPlane Frontend (React Vite)" cmd /k "cd frontend && npm.cmd run dev"

echo.
echo ControlPlane Backend:  http://localhost:8000 (API Docs: http://localhost:8000/docs)
echo ControlPlane Frontend: http://localhost:5173
echo.
echo All services launched in background windows!
