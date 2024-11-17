#!/bin/bash

# Load environment variables
set -a
source .env
set +a

# Kill existing processes
lsof -ti:5001 | xargs kill -9
lsof -ti:3000 | xargs kill -9

# Start backend
cd backend/src
python app.py &
BACKEND_PID=$!

# Start frontend
cd ../../frontend
npm start &
FRONTEND_PID=$!

# Trap to ensure processes are killed on script exit
trap 'kill $BACKEND_PID $FRONTEND_PID' EXIT

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID