#!/bin/bash

echo "🚀 -----------------------------------"
echo "🚀 Starting upLIFT Unified Launch Sequence..."
echo "🚀 -----------------------------------"

# Supabase Note
echo "💾 Database Note: Your Supabase cloud database is remote and always active. No local boot needed."

# 1. Start AI Engine (FastAPI)
echo "🧠 [1/3] Starting Python AI Engine (Port 8000)..."
cd ai_engine
# Use pyenv Python directly — groq + httpx are installed there
PYENV_PYTHON="/Users/pratikkumar/.pyenv/versions/3.10.14/bin/python"
$PYENV_PYTHON -m uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
AI_PID=$!
cd ..

# Wait a second to space out heavy init commands
sleep 1 

# 2. Start Backend (Express Gateway)
echo "⚙️ [2/3] Starting Node Express Backend (Port 3001)..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

sleep 1

# 3. Start Frontend (Next.js)
echo "🎨 [3/3] Starting Next.js Frontend (Port 3000)..."
cd frontend
# Bind to 0.0.0.0 so we can access from mobile on the same network
npm run dev -- --hostname 0.0.0.0 &
FRONTEND_PID=$!
cd ..

# Get Local IP for Mobile access
LOCAL_IP=$(ipconfig getifaddr en0 || ipconfig getifaddr en1 || echo "localhost")

echo ""
echo "✅ All systems successfully dispatched!"
echo "🚀 -----------------------------------"
echo "📍 Local:   http://localhost:3000"
echo "📱 Network: http://$LOCAL_IP:3000   <-- Use this on your mobile!"
echo "⚙️ Backend: http://$LOCAL_IP:3001"
echo "🧠 AI:      http://$LOCAL_IP:8000"
echo "🚀 -----------------------------------"
echo "Press CMD+C (CTRL+C) to gracefully stop all servers."

# Trap CTRL+C to cleanly kill all background processes
trap "echo 'Terminating upLIFT servers...'; kill $AI_PID $BACKEND_PID $FRONTEND_PID; exit" SIGINT

# Keep the terminal window open and listening
wait
