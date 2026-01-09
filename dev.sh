#!/bin/bash

# Development script to start both API and Frontend servers
# This script ensures the API uses file-based database (no AWS credentials needed)

set -e

echo "🚀 Starting Little Fire Flames Development Environment"
echo ""

# Check if node_modules exist, install if needed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing root dependencies..."
  npm install
fi

if [ ! -d "api/node_modules" ]; then
  echo "📦 Installing API dependencies..."
  cd api && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
  echo "📦 Installing Frontend dependencies..."
  cd frontend && npm install && cd ..
fi

# Ensure data directory exists
mkdir -p data

# Set environment variables for local development
export USE_LOCAL_DB=true
export NODE_ENV=development
export PORT=3001

echo "✅ Using file-based database (data/events.db.txt)"
echo "✅ No AWS credentials required for local development"
echo ""

# Start both servers using concurrently
echo "🌐 Starting API server on http://localhost:3001"
echo "🌐 Starting Frontend on http://localhost:8080"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

npx concurrently \
  --names "API,FRONTEND" \
  --prefix-colors "cyan,magenta" \
  "cd api && npm run dev" \
  "cd frontend && npm run dev"

