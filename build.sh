#!/bin/bash
set -e  # Exit immediately if a command exits with a non-zero status

echo "🔍 Node version:"
node --version
echo "🔍 NPM version:"
npm --version

echo "🧹 Cleaning node_modules..."
rm -rf node_modules
rm -rf frontend/node_modules
rm -rf backend/node_modules

echo "📦 Installing root dependencies..."
npm install

echo "📦 Installing frontend dependencies..."
cd frontend
npm install --legacy-peer-deps
echo "🔧 Frontend dependencies installed successfully"

echo "🏗️ Building frontend..."
npm run build
echo "✅ Frontend built successfully"
cd ..

echo "📦 Installing backend dependencies..."
cd backend
npm install
echo "🔧 Backend dependencies installed successfully"
cd ..

echo "🎉 Build completed successfully!" 