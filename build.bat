@echo off
echo 🔍 Node version:
node --version
echo 🔍 NPM version:
npm --version

echo 🧹 Cleaning node_modules and lock files...
if exist node_modules rmdir /s /q node_modules
if exist frontend\node_modules rmdir /s /q frontend\node_modules
if exist backend\node_modules rmdir /s /q backend\node_modules
if exist frontend\package-lock.json del /f frontend\package-lock.json
if exist backend\package-lock.json del /f backend\package-lock.json

echo 📦 Installing root dependencies...
call npm install --no-package-lock

echo 📦 Installing frontend dependencies...
cd frontend
call npm install --no-package-lock
echo 🔧 Frontend dependencies installed successfully

echo 🏗️ Building frontend...
call npm run build
echo ✅ Frontend built successfully
cd ..

echo 📦 Installing backend dependencies...
cd backend
call npm install --no-package-lock
echo 🔧 Backend dependencies installed successfully
cd ..

echo 🎉 Build completed successfully! 