@echo off
echo Starting MOM Project...

echo [1/3] Starting MySQL service (checking if it needs to be started)...
:: If you use XAMPP, you might need to start it manually or point to the executable
:: Example for XAMPP: start C:\xampp\xampp_start.exe
:: Since we don't know the exact MySQL setup, we'll just prompt the user if it fails.

echo [2/3] Starting Backend (NestJS)...
cd backend
start cmd /k "npm run start:dev"
cd ..

echo [3/3] Starting Frontend (Next.js)...
cd frontend
start cmd /k "npm run dev"
cd ..

echo.
echo ===================================================
echo Backend is starting on http://localhost:5000
echo Frontend is starting on http://localhost:3000
echo ===================================================
echo.
echo Note: If the backend fails to connect to the database,
echo please make sure your MySQL server is running!
echo.
pause
