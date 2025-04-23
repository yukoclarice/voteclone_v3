#!/bin/bash
set -e  # Exit immediately if a command exits with a non-zero status

echo "🔍 Node version:"
node --version
echo "🔍 NPM version:"
npm --version

echo "🧹 Cleaning node_modules and lock files..."
rm -rf node_modules
rm -rf frontend/node_modules
rm -rf backend/node_modules
# Remove lock files to avoid conflicts
rm -f frontend/package-lock.json
rm -f backend/package-lock.json

echo "📦 Installing root dependencies..."
npm install --no-package-lock

echo "📦 Installing frontend dependencies..."
cd frontend
npm install --no-package-lock
echo "🔧 Frontend dependencies installed successfully"

echo "🏗️ Building frontend..."
npm run build
echo "✅ Frontend built successfully"
cd ..

echo "📦 Installing backend dependencies..."
cd backend
npm install --no-package-lock
echo "🔧 Backend dependencies installed successfully"
cd ..

echo "🎉 Build completed successfully!" 